const { TwitterApi } = require("twitter-api-v2");
const { client } = require("../discord-bot/discord-bot");
const { clean, asArray } = require("../helpers/common");
const db = require("../helpers/db-init");
const { socketSendUserSubmissionStatus } = require("../helpers/socket-messages");
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
            if ((err.code === 503) && (retries < 5)) {
                retries += 1
                return main()
            }
            else throw (err)
        }
    }
    return main()
}


const twitter_delete_tweet = async (accessToken, tweet_id) => {
    const main = async () => {
        try {
            const client = new TwitterApi(accessToken)
            const { data: { deleted } } = await client.v2.deleteTweet(tweet_id)
            return deleted
        } catch (err) {
            if ((err.code === 503) && (retries < 5)) {
                retries += 1
                return main()
            }
            else throw (err)
        }
    }
    return main()
}


const fetch_quote_tweets = async (tweet_id) => {
    try {
        return await appClient.v2.quotes(tweet_id, { expansions: ['author_id', 'attachments.media_keys'], 'user.fields': ['username', 'url'], "tweet.fields": "created_at", max_results: 100 },)
    } catch (err) {
        const errors = TwitterApi.getErrors(err)
        console.log(errors)
        return null
    }
}

// should only set registering message if they havent already submitted
// already submitted means that this wallet + twitter account has already made a sub in the contest

const sendUserMessage = async (contest, quote) => {
    // get the user addresses that have submitted for this contest with this twitter account (could be more than 1)
    let has_submitted = await db.query('select contest_submissions.id from contest_submissions inner join users on users.address = contest_submissions.author where users.twitter->>\'id\' = $1', [quote.author_id])
        .then(clean)

    if (!has_submitted) {
        db.query('select address from users where twitter->>\'id\' = $1', [quote.author_id])
            .then(clean)
            .then(data => {
                // if user exists in the DB, send a pending message to all linked addresses for the account
                if (data) {
                    console.log('attempting to send socket message to address', data.address)
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
        .catch(err => { return err })
}

const handle_fetched_tweet = async (tweet) => {
    console.log('handling streamed tweet')
    console.log(tweet)
    let contest = { hash: tweet.matching_rules[0].tag }
    return await register_tweet(contest, tweet.data)
}


const get_tweet = async (tweet_id) => {
    try {
        return await appClient.v2.singleTweet(tweet_id, { expansions: ['attachments.media_keys'], "media.fields": ["url", "preview_image_url"], "tweet.fields": ["text"] })
    } catch (err) {
        const errors = TwitterApi.getErrors(err)
        console.log(errors)
        return null
    }

}

const get_thread = async (tweet_id, author_id) => {
    try {
        return await appClient.v2.search(`conversation_id:${tweet_id} from:${author_id} to:${author_id}`, { expansions: ['attachments.media_keys'], "media.fields": ["url", "preview_image_url"], "tweet.fields": ["text"], max_results: 100 })
    } catch (err) {
        const errors = TwitterApi.getErrors(err)
        console.log(errors)
        return null
    }
}

module.exports = { twitter_send_tweet, twitter_delete_tweet, fetch_quote_tweets, handle_fetched_tweet, get_tweet, get_thread, register_tweet }