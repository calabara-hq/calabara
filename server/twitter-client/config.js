const dotenv = require('dotenv');
const { TwitterApi } = require('twitter-api-v2');
dotenv.config();

const TOKENS = {
    clientId: process.env.TWITTER_OAUTH_CLIENT_ID,
    clientSecret: process.env.TWITTER_OAUTH_CLIENT_SECRET
}


const requestClient = new TwitterApi({ ...TOKENS })

const appClient = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});


const bearerClient = new TwitterApi(process.env.TWITTER_BEARER)


module.exports = { TOKENS, requestClient, appClient, bearerClient }