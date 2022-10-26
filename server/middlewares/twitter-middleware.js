const db = require('../helpers/db-init')
const { clean } = require('../helpers/common')
const { TwitterApi } = require('twitter-api-v2')
const dotenv = require('dotenv')
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
        return res.sendStatus(440)
    }
}


const process_thread = (thread) => {
    return thread.map(el => {
        let { text, media } = el
        if (media) {
            let { media_id } = media
            return { text, media: { media_ids: [media_id] } }
        }
        return el
    })
}




async function sendTweet(req, res, next) {
    const { tweet } = req.body

    if (!req.session.twitter.accessToken) return res.sendStatus(440)
    let processed_thread = process_thread(tweet)
    const client = new TwitterApi(req.session.twitter.accessToken);

    try {
        let result = await client.v2.tweetThread(processed_thread)
        console.log('THIS IS THE RESULT!!', result[0].data.id)
        req.announcementID = JSON.stringify(result[0].data.id)
        next();
    }
    catch (err) {
        console.log(err)
        if (err.data.status === 403) return res.sendStatus(441)
        return res.sendStatus(442)
    }
}



async function sendQuoteTweet(req, res, next) {
    const { ens, contest_hash, tweet } = req.body
    const twitter_settings = await pre_process(ens, contest_hash)
    if (!twitter_settings) return res.send('not a twitter contest').status(439)
    const { announcementID } = twitter_settings

    const { accessToken } = req.session.twitter;
    if (!accessToken) return res.sendStatus(440)

    let processed_thread = process_thread(tweet)

    processed_thread[0].quote_tweet_id = announcementID

    const client = new TwitterApi(accessToken);

    try {
        await client.v2.tweetThread(processed_thread)
        next();
    }
    catch (err) {
        console.log(err)
        if (err.status === 403) return res.sendStatus(441)
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




module.exports = { verifyTwitterAuth, sendTweet, sendQuoteTweet, convertTweet }