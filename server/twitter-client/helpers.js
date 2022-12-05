const { TwitterApi } = require("twitter-api-v2");
const { clean, asArray } = require("../helpers/common");
const db = require("../helpers/db-init");
const { socketSendUserSubmissionStatus } = require("../helpers/socket-messages");
const logger = require("../logger").child({ service: "twitter_api" })
const { appClient } = require("./config");


// retry up to 5 times on 503 errors

const twitter_send_tweet = async (accessToken, data) => {
    let retries = 0;
    const main = async () => {
        try {
            const client = new TwitterApi(accessToken)
            const result = await client.v2.tweetThread(data)
            return JSON.stringify(result[0].data.id)
        } catch (err) {
            logger.log({ level: 'error', message: `send tweet failed with error: ${JSON.stringify(err)}` })
            if ((err.code === 503) && (retries < 5)) {
                logger.log({ level: 'error', message: `send tweet failed with error 503. Retrying with ${retries + 1} remaining retries` })
                retries += 1
                return main()
            }
            else {
                logger.log({ level: 'error', message: `send tweet failed with an irreversible error. Ran out of retries and gave up` })
                throw (err)
            }
        }
    }
    return main()
}


const twitter_delete_tweet = async (accessToken, tweet_id) => {
    let retries = 0
    const main = async () => {
        try {
            const client = new TwitterApi(accessToken)
            const { data: { deleted } } = await client.v2.deleteTweet(tweet_id)
            return deleted
        } catch (err) {
            logger.log({ level: 'error', message: `delete tweet failed with error: ${JSON.stringify(err)}` })
            if ((err.code === 503) && (retries < 5)) {
                logger.log({ level: 'error', message: `delete tweet failed with error 503. Retrying with ${retries + 1} remaining retries` })
                retries += 1
                return main()
            }
            else {
                logger.log({ level: 'error', message: `delete tweet failed with an irreversible error. Ran out of retries and gave up` })
                throw (err)
            }
        }
    }
    return main()
}


const fetch_quote_tweets = async (tweet_id) => {
    try {
        return await appClient.v2.quotes(tweet_id, { exclude: ['retweets'], expansions: ['author_id', 'attachments.media_keys'], 'user.fields': ['username', 'url'], "tweet.fields": "created_at", max_results: 100, })
    } catch (err) {
        const errors = TwitterApi.getErrors(err)
        logger.log({ level: 'error', message: `fetch quote tweet failed with error: ${JSON.stringify(errors)}` })
        return null
    }
}

// should only set registering message if they havent already submitted
// already submitted means that this wallet + twitter account has already made a sub in the contest

const sendUserMessage = async (contest, quote) => {
    // get the user addresses that have submitted for this contest with this twitter account (could be more than 1)
    let has_submitted = await db.query('select contest_submissions.id from contest_submissions inner join users on users.address = contest_submissions.author where contest_submissions.contest_hash = $1 and users.twitter->>\'id\' = $2', [contest.hash, quote.author_id])
        .then(clean)


    if (!has_submitted) {
        db.query('select address from users where twitter->>\'id\' = $1', [quote.author_id])
            .then(clean)
            .then(data => {
                // if user exists in the DB, send a pending message to all linked addresses for the account
                if (data) {
                    socketSendUserSubmissionStatus(data.address, contest.hash, 'registering')
                }
            })
    }
}

const register_tweet = async (contest, quote) => {
    return await db.query('insert into tweets (tweet_id, author_id, created, contest_hash, locked, registered) values ($1, $2, $3, $4, $5, $6)', [quote.id, quote.author_id, quote.created_at, contest.hash, false, false])
        .then(() => {
            sendUserMessage(contest, quote)
        })
        .catch(err => {
            logger.log({ level: 'error', message: `register tweet failed with error: ${JSON.stringify(err)}` })
        })
}

const handle_fetched_tweet = async (tweet) => {
    logger.log({ level: 'info', message: 'handling streamed tweet' })
    let contest = { hash: tweet.matching_rules[0].tag }
    return await register_tweet(contest, tweet.data)
}


const get_tweet = async (tweet_id) => {
    try {
        return await appClient.v2.singleTweet(tweet_id, { expansions: ['attachments.media_keys'], "media.fields": ["url", "preview_image_url"], "tweet.fields": ["text", "entities"] })
    } catch (err) {
        const errors = TwitterApi.getErrors(err)
        logger.log({ level: 'error', message: `get tweet failed with error: ${JSON.stringify(errors)}` })
        return null
    }

}

const get_thread = async (tweet_id, author_id) => {
    try {
        return await appClient.v2.search(`conversation_id:${tweet_id} from:${author_id} to:${author_id}`, { expansions: ['attachments.media_keys'], "media.fields": ["url", "preview_image_url"], "tweet.fields": ["text", "entities"], max_results: 100 })
    } catch (err) {
        const errors = TwitterApi.getErrors(err)
        logger.log({ level: 'error', message: `get thread failed with error: ${JSON.stringify(errors)}` })
        return null
    }
}

module.exports = { twitter_send_tweet, twitter_delete_tweet, fetch_quote_tweets, handle_fetched_tweet, get_tweet, get_thread, register_tweet }