const db = require('../helpers/db-init')
const { clean } = require('../helpers/common')
const { TwitterApi } = require('twitter-api-v2')
const dotenv = require('dotenv')
const { twitter_send_tweet } = require('../twitter-client/helpers')
const logger = require('../logger').child({ service: 'middleware:twitter' })
dotenv.config()


const pre_process = async (ens, contest_hash) => {
    let twitter_settings = await db.query('select settings ->\'twitter_integration\' as twitter_integration from contests where ens = $1 and _hash = $2', [ens, contest_hash])
        .then(clean)

    return twitter_settings.twitter_integration
}

// get announcement tweet ID


async function verifyTwitterAuth(req, res, next) {
    try {
        const client = new TwitterApi(req.session.twitter.accessToken)
        await client.v2.me();
        next();
    } catch (err) {
        logger.log({ level: 'info', message: 'user twitter session is not active' })
        return res.sendStatus(440)
    }
}


// keep track of the user account for future reference
const update_user_twitter = async (address, data) => {
    // flush the db of any addresses linked to this same twitter account. Want only 1 twitter linked to 1 address at a time (for now)

    await db.query('update users set twitter = null where twitter->>\'id\' = $1', [data.id])
    return db.query('insert into users (address, twitter) values ($1, $2) on conflict (address) do update set twitter = $2', [address, data])
        .catch(err => console.log(err))
}


async function poll_auth_status(req, res, next) {

    const { codeVerifier, stateVerifier, state, code, accessToken, retries } = req.session.twitter || {};

    try {

        if (!codeVerifier || !stateVerifier) return res.send({ status: 'error' }).status(200)

        req.session.twitter.retries = typeof retries === undefined ? 0 : retries + 1

        // there was an error in the oauth process

        if (retries > 19) {
            req.session.twitter.retries = 0;
            return res.send({ status: 'error' }).status(200)
        }


        // if the user refuses app access, code will not be provided
        if (codeVerifier && stateVerifier && state && !code) {
            return res.send({ status: 'error' }).status(200)
        }

        if (codeVerifier && stateVerifier && state && code) {
            if (stateVerifier !== state) return res.send({ status: 'error' }).status(200)
        }


        if (codeVerifier && stateVerifier && !accessToken) {
            // user got the auth link but hasn't yet approved the authorization
            return res.send({ status: 'pending' }).status(200)
        }

        if (accessToken) {
            if (state !== stateVerifier) return res.send({ status: 'error' }).status(200)
            const client = new TwitterApi(accessToken);
            const { data: user } = await client.v2.me({ "user.fields": ["profile_image_url"] });
            req.session.twitter.user = user
            update_user_twitter(req.session.user.address, user)
            res.send({ status: 'ready', user })
        }
    } catch (e) {
        return res.send({ status: 'error' }).status(200)
    }
}


const process_thread = (thread) => {
    try {
        return thread.map(el => {
            let { text, media } = el
            if (media) {
                let { media_id } = media
                return { text, media: { media_ids: [media_id] } }
            }
            return el
        })
    } catch (e) {
        logger.log({ level: 'error', message: `failed processing twitter thread with error: ${e}` })
        return null
    }
}

async function verifyTwitterContest(req, res, next) {
    const { ens, contest_hash } = req.body
    console.log(ens, contest_hash)
    try {
        const twitter_settings = await pre_process(ens, contest_hash)
        if (!twitter_settings) return res.send('not a twitter contest').status(439)
        const { announcementID } = twitter_settings
        req.announcementID = announcementID
        next()
    } catch (e) {
        logger.log({ level: 'error', message: 'attempted service for non-twitter contest' })
        return res.send('not a twitter contest').status(439)
    }
}



async function sendTweet(req, res, next) {
    const { tweet } = req.body
    const { accessToken } = req.session.twitter || {};
    if (!accessToken) return res.sendStatus(440)

    let processed_thread = process_thread(tweet)
    if (!processed_thread) return res.sendStatus(443)

    try {
        let tweet_id = await twitter_send_tweet(accessToken, processed_thread)
        req.announcementID = tweet_id
        next();
    }
    catch (err) {
        logger.log({ level: 'error', message: `send tweet failed with error: ${JSON.stringify(err)}` })
        if (err.data.title === 'Unsupported Authentication') return res.sendStatus(440)
        if (err.data.title === 'Forbidden') return res.sendStatus(441)
        if (err.code === 503) return res.sendStatus(444)
        return res.sendStatus(442)
    }
}

async function sendQuoteTweet(req, res, next) {
    const { tweet } = req.body

    const announcementID = req.announcementID
    const { accessToken } = req.session.twitter || {};

    if (!accessToken) return res.sendStatus(440)
    if (!announcementID) return res.sendStatus(400)
    let processed_thread = process_thread(tweet)
    if (!processed_thread) return res.sendStatus(443)

    processed_thread[0].quote_tweet_id = announcementID

    try {
        let tweet_id = await twitter_send_tweet(accessToken, processed_thread)
        req.tweet_id = tweet_id
        next()

    }
    catch (err) {
        logger.log({ level: 'error', message: `send quote tweet failed with error: ${JSON.stringify(err)}` })
        if (err.data.title === 'Unsupported Authentication') return res.sendStatus(440)
        if (err.data.title === 'Forbidden') return res.sendStatus(441)
        if (err.code === 503) return res.sendStatus(444)
        return res.sendStatus(442)
    }


}


// convert a tweet into a calabara submission.
// tweet[0] becomes tldr 
// tweet [1:n] becomes body

const randomId = (length) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function convertTweet(req, res, next) {
    const { ens, contest_hash, tweet } = req.body

    let submission_obj = {}
    let submission_body_obj = {
        time: Date.now(),
        blocks: [],
        version: "2.25.0"
    }

    tweet.map((el, idx) => {
        if (idx === 0) {
            if (el.text) {
                submission_obj.tldr_text = el.text
            }
            if (el.media) {
                submission_obj.tldr_image = el.media.url
            }
        }

        else {
            const { text, media } = el
            if (text) {
                submission_body_obj.blocks.push({
                    id: randomId(10),
                    type: "paragraph",
                    data: {
                        text: el.text
                    }
                })
            }
            if (media) {
                submission_body_obj.blocks.push({
                    id: randomId(10),
                    type: "image",
                    data: {
                        file: {
                            url: media.url
                        },
                        caption: "",
                        withBorder: false,
                        stretched: false,
                        withBackground: false
                    }
                })
            }
        }

    })

    if (submission_body_obj.blocks.length > 0) {
        submission_obj.submission_body = submission_body_obj
    }
    else {
        submission_obj.submission_body = null
    }
    submission_obj.created = new Date().toISOString()
    req.body.submission = submission_obj

    next();
}




module.exports = { verifyTwitterAuth, process_thread, verifyTwitterContest, poll_auth_status, sendTweet, sendQuoteTweet, convertTweet }