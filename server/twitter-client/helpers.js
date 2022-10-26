const { TwitterApi } = require("twitter-api-v2")


// retry up to 5 times on 503 errors

const twitter_send_tweet = async (accessToken, data) => {
    let retries = 0;
    const main = async () => {
        try {
            const client = new TwitterApi(accessToken)
            const result = await client.v2.tweetThread(data)
            return result[0].data.id
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


module.exports = { twitter_send_tweet, twitter_delete_tweet }