const dotenv = require('dotenv');
const { TwitterApi } = require('twitter-api-v2');
dotenv.config();

const TOKENS = {
    clientId: process.env.TWITTER_OAUTH_CLIENT_ID,
    clientSecret: process.env.TWITTER_OAUTH_CLIENT_SECRET
}

const requestClient = new TwitterApi({ ...TOKENS })

module.exports = { TOKENS, requestClient }