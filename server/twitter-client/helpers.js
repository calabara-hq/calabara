const { TwitterApi } = require("twitter-api-v2");
const { client } = require("../discord-bot/discord-bot");
const db = require("../helpers/db-init");
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


const handle_fetched_tweet = async (tweet) => {
    console.log(tweet)
    let contest_hash = tweet.matching_rules[0].tag
    await db.query('insert into tweets (tweet_id, author_id, created, contest_hash, locked, registered) values ($1, $2, $3, $4, $5, $6)', [tweet.data.id, tweet.data.author_id, tweet.data.created_at, contest_hash, false, false])
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

module.exports = { twitter_send_tweet, twitter_delete_tweet, fetch_quote_tweets, handle_fetched_tweet, get_tweet, get_thread }