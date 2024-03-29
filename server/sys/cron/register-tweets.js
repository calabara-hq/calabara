const cron = require('node-cron')
const db = require('../../helpers/db-init.js')
const { EVERY_30_SECONDS, EVERY_10_SECONDS } = require('./schedule')
const fs = require('fs');
const path = require('path');
const crypto = require('crypto')
const { TwitterV2IncludesHelper } = require('twitter-api-v2')
const { clean, asArray, serializedLoop, parallelLoop } = require('../../helpers/common.js');
const { get_thread, get_tweet } = require('../../twitter-client/helpers.js');
const { checkWalletTokenBalance } = require('../../web3/web3.js');
const fetch = require('node-fetch');
const { socketSendNewSubmission, socketSendUserSubmissionStatus } = require('../../helpers/socket-messages.js');
const logger = require('../../logger.js').child({ service: 'cron:register_tweets' })

const serverBasePath = path.normalize(path.join(__dirname, '../../'))



const groupBy = (items, key) => items.reduce(
    (result, item) => ({
        ...result,
        [item[key]]: [
            ...(result[item[key]] || []),
            item,
        ],
    }),
    {},
);

const randomId = (length) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// insert 30 seconds buffer to voting end since this loop only runs every 30 secs
const getDates = () => {
    const now = new Date()
    return { t1: now.toISOString(), t2: new Date(now.getTime() - (30 * 1000)).toISOString() }
}


// select unregistered tweets. group by author id

const pull_unregistered_tweets = async () => {
    let dates = getDates();
    return await db.query('select author_id, json_agg(json_build_object(\'tweet_id\', tweets.tweet_id, \'created\', tweets.created, \'contest_hash\', tweets.contest_hash)) as contests \
                        from tweets inner join contests on tweets.contest_hash = contests._hash \
                        where registered = false and contests._start < $1 and contests._voting > $2 \
                        group by author_id', [dates.t1, dates.t2])
        .then(clean)
        .then(asArray)
}

const lookup_twitter_user = async (twitter_user_id) => {
    return await db.query('select address from users where twitter->>\'id\' = $1', [twitter_user_id])
        .then(clean)
        .then(data => data ? data.address : null)
}


const pull_contest = async (contest_hash) => {
    return await db.query('select ens, settings->\'submitter_restrictions\' as restrictions, settings->\'snapshot_block\' as snapshot_block, _hash, settings->\'twitter_integration\' as twitter_integration from contests where _hash = $1', [contest_hash])
        .then(clean)
}


// users can have multiple addresses linked to the same account. 
// we'll loop over addresses and determine if they have already submitted or not
const has_already_submitted = async (tweet, user_address) => {
    return await db.query('select id from contest_submissions where contest_hash=$1 and author=$2', [tweet.contest_hash, user_address])
        .then(clean)
        .then(sub => sub ? true : false)
}

// users can have multiple addresses linked to the same account. 
// we'll loop over addresses and determine if any are eligible for the contest
// if one of them is eligible, return the address
const compute_restrictions = async (contest_data, user_address) => {

    if (contest_data.restrictions.length === 0) return true
    for (const restriction of contest_data.restrictions) {
        if (restriction.type === 'erc20' || restriction.type === 'erc721' || restriction.type === 'erc1155') {
            let result = await checkWalletTokenBalance(user_address, restriction.address, restriction.decimal, contest_data.snapshot_block, restriction.token_id)
            if (result >= restriction.threshold) return true
        }
    }

    return false // if we made it this far, address does not qualify to submit
}


// pull media
// set url in block
// return block
const write_media = async (media) => {
    let url
    if (!media) return null
    if (media.type === 'video') return null
    if (media.type === 'photo') url = media.url
    if (media.type === 'animated_gif') url = media.preview_image_url

    let now = new Date().toISOString()
    const media_url = path.normalize(path.join('/contest-assets/staging/media', '_' + now + '_' + path.extname(url)))
    const destination = path.normalize(path.join(serverBasePath, media_url))

    // download the media
    const fileStream = fs.createWriteStream(destination);
    const res = await fetch(url)
    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve);
    });
    return media_url
}

// remove twitter links
// resolve non-twitter links to expanded url
// include non-twitter links
const parse_text_urls = async (text, urls) => {
    for (const url of urls) {
        if (url.expanded_url.slice(0, 20) === 'https://twitter.com/') {
            text = text.replace(url.url, "")
        }
        else {
            text = text.replace(url.url, url.expanded_url)
        }
    }
    return text
}

const parse_tldr = async (head) => {
    const includes = new TwitterV2IncludesHelper(head)
    const media = includes.media
    let { id, text, entities } = head.data
    let leftover_media = null
    let tldr_obj = {
        tldr_text: null,
        tldr_image: null
    }
    let parsed_text = await parse_text_urls(text, entities.urls)
    if (text) {
        tldr_obj.tldr_text = parsed_text === "" ? null : parsed_text
    }
    if (media.length > 0) {
        const media_url = await write_media(media[0])
        tldr_obj.tldr_image = media_url
        if (media.length > 1) leftover_media = media.slice(1)
    }
    return { tldr_obj: tldr_obj, leftover_media: leftover_media }

}

const create_text_block = async (text, entities) => {
    let parsed_text = await parse_text_urls(text, entities.urls)
    if (parsed_text === "") return null
    return {
        id: randomId(10),
        type: "paragraph",
        data: {
            text: parsed_text
        }
    }
}

const create_media_block = async (media) => {
    const media_url = await write_media(media)
    if (!media_url) return null
    return {
        id: randomId(10),
        type: "image",
        data: {
            file: {
                url: media_url
            },
            caption: "",
            withBorder: false,
            stretched: false,
            withBackground: false
        }
    }
}


// get the full tweet thread
// parse and convert media 
const create_submission = async (tweet, author_id) => {
    let submission_obj = {}
    let submission_body_obj = {
        time: Date.now(),
        blocks: [],
        version: "2.25.0"
    }
    const head_tweet = await get_tweet(tweet.tweet_id)  // get first tweet
    let tldr_result = await parse_tldr(head_tweet)      // parse the tldr
    submission_obj = tldr_result.tldr_obj               // set the tldr portion
    if (tldr_result.leftover_media) {                   // if there is leftover media, add it in the next few submission blocks
        await serializedLoop(tldr_result.leftover_media, async (tldr_media) => {
            let tldr_media_block = await create_media_block(tldr_media)
            if (tldr_media_block) submission_body_obj.blocks.push(tldr_media_block)
        })
    }

    const thread = await get_thread(tweet.tweet_id, author_id) // get the thread
    const includes = new TwitterV2IncludesHelper(thread)


    if (thread.meta.result_count > 0) {
        let thread_arr = thread.data.data.reverse()            // get it in chronological order
        await serializedLoop(thread_arr, async (thread_el) => {
            const { id, text, entities } = thread_el
            const medias = includes.medias(thread_el)

            if (text) {
                let text_block = await create_text_block(text, entities)
                if (text_block) submission_body_obj.blocks.push(text_block)
            }

            await serializedLoop(medias, async (media_el) => {
                let media_block = await create_media_block(media_el)
                if (media_block) submission_body_obj.blocks.push(media_block)
            })

        })
    }

    submission_obj.submission_body = submission_body_obj
    return submission_obj

}


const write_submission = async (submission, contest_data, address, tweet_id) => {
    let created = new Date().toISOString();
    submission.created = created;
    let submission_hash = crypto.createHash('md5').update(JSON.stringify(submission)).digest('hex').slice(-8);
    let destination_folder = `contest-assets/staging/submissions/${submission_hash}`
    let submission_url = `${destination_folder}.json`

    await new Promise((resolve, reject) => {
        const writestream = fs.createWriteStream(path.normalize(path.join(serverBasePath, submission_url)))
        writestream.write(JSON.stringify(submission), async err => {
            if (err) reject(err)
            resolve('done')
        })
    });


    let url = '/' + submission_url
    return await db.query('insert into contest_submissions (ens, contest_hash, author, created, locked, pinned, _url, meta_data) values ($1, $2, $3, $4, $5, $6, $7, $8) returning id ', [contest_data.ens, contest_data._hash, address, created, false, false, url, { tweet_id: tweet_id }])
        .then(clean)
        .then(result => {
            socketSendNewSubmission(contest_data._hash, contest_data.ens, { id: result.id, _url: url, author: address, votes: 0 })
            socketSendUserSubmissionStatus(address, contest_data._hash, 'submitted')
        })
        .catch(err => {
            logger.log({ level: 'error', message: `failed writing submission for tweet_id: ${tweet_id}` })
        })


}

// unlock and mark all tweets from this user for this contest as registered
const cleanup = async (author_id, contest_hash) => {
    try {
        return await db.query('update tweets set registered = true where author_id = $1 and contest_hash = $2', [author_id, contest_hash])
    } catch (err) {
        logger.log({ level: 'error', message: `failed setting register for author_id: ${author_id} and contest: ${contest_hash}` })
    }
}


const get_latest = (hash) => {
    return hash.reduce((a, b) => {
        return new Date(a.created) > new Date(b.created) ? a : b;
    })
}

// grab unregistered tweets
// group by author id
// search our db for known users

// for each user, find their latest tweet for each unique contest hash
// check if they qualify
// ignore qt's from admin account

const main_loop = async () => {
    const users = await pull_unregistered_tweets();
    if (!users) return
    await parallelLoop(users, async (user_tweets_obj) => {
        // lookup the twitter user in DB
        let user_address = await lookup_twitter_user(user_tweets_obj.author_id)
        // return if twitter user not registered in DB
        if (!user_address) return // dont cleanup here, we can add them when they come back
        // group user tweets by hash
        let grouped_by_hash = groupBy(user_tweets_obj.contests, 'contest_hash')
        // for each user tweet from a particular contest
        await parallelLoop(Object.values(grouped_by_hash), async (hash) => {
            // get the most recent tweet
            let latest_tweet = get_latest(hash)
            let contest_data = await pull_contest(latest_tweet.contest_hash)
            let has_submitted = await has_already_submitted(latest_tweet, user_address)
            if (has_submitted) return cleanup(user_tweets_obj.author_id, latest_tweet.contest_hash) // cleanup if user already submitted
            let is_eligible = await compute_restrictions(contest_data, user_address)
            if (!is_eligible) return cleanup(user_tweets_obj.author_id, latest_tweet.contest_hash) // cleanup if user doesnt have an eligible wallet
            let submission = await create_submission(latest_tweet, user_tweets_obj.author_id)
            await write_submission(submission, contest_data, user_address, latest_tweet.tweet_id)
            logger.log({ level: 'info', message: `successfully registered submission for tweet_id: ${latest_tweet.tweet_id}` })
            // unlock and mark has registered in db. 
            cleanup(user_tweets_obj.author_id, latest_tweet.contest_hash)
        })
    })
}


const register_tweets = (frequency) => {
    cron.schedule(frequency, () => {
        logger.log({ level: 'info', message: 'attempting to register tweets' })
        main_loop();
    })
}



module.exports = { pull_unregistered_tweets, main_loop, register_tweets, parse_tldr, create_submission }


// upgrade ->> allow users to update submissions by quote tweeting again
// if a user has connected multiple accounts, we need to pick one to use for their submission
// given a user address array, return 1 address that qualifies for the contest
// 1 submission per twitter ID
// if they have already submitted, use the same address to overwrite or keep existing sub.
// if they haven't submitted, the one that passes all requirements
// if more than one pass requirements and they haven't submitted before, use the most recently updated (length - 1)
/*
const calculate_update_data = async (tweet, user_addresses) => {
    let submission_address;
    if (user_addresses.length === 1) {
        submission_address = user_addresses[0].address
        let prev_submission = await db.query('select * from contest_submissions where contest_hash = $1 and author = $2', [tweet.contest_hash, submission_address])
            .then(clean)
        if (!prev_submission) {
            // user hasnt submitted. check requirements and post if successful
        }
        else {
            // user has submitted. check if this tweet is more recent than prev submission.
            // if it's a match, do nothing
            if (tweet.tweet_id === prev_submission.meta_data.tweet_id) return
            // otherwise, we have to update their submission
            // check requirements and post if successful
            console.log('WE SHOULD UPDATE')
        }
    }
    
        else if (user_addresses.length > 1) {
            console.log('GREATER THAN 1')
            for (const address_el of user_addresses) {
                console.log('running with address ', address_el)
                let submission = await db.query('select * from contest_submissions where contest_hash = $1 and author = $2', [tweet.contest_hash, address_el.address])
                    .then(clean)
                console.log(submission)
            }
        }
    
}
*/