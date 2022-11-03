const httpMocks = require('node-mocks-http')
const { sendQuoteTweet, sendTweet } = require('../../middlewares/twitter-middleware');
const { expect } = require('chai');
const { TwitterApi } = require('twitter-api-v2');
const { twitter_delete_tweet } = require('../../twitter-client/helpers');


const CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY
const CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET
const ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN_KEY
const ACCESS_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET

describe('send tweet', async (done) => {


    it('null access token', async () => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            session: {}
        })

        const response = httpMocks.createResponse();

        await sendTweet(request, response, () => { })
        expect(response.statusCode).to.eql(440)

    })


    it('simple tweet', async () => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            session: {
                twitter: {
                    accessToken: {
                        appKey: CONSUMER_KEY,
                        appSecret: CONSUMER_SECRET,
                        accessToken: ACCESS_TOKEN,
                        accessSecret: ACCESS_SECRET
                    }
                }
            },
            body: {
                tweet: [
                    { text: 'test tweet' }
                ]
            },

        })

        const response = httpMocks.createResponse();

        await sendTweet(request, response, () => { })
        expect(response.statusCode).to.eql(200)
        let tweet_id = JSON.parse(request.announcementID)
        // delete the tweet
        let deleted = await twitter_delete_tweet(request.session.twitter.accessToken, tweet_id)
        expect(deleted).to.equal(true);


    })


    it('duplicate tweet', async () => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            session: {
                twitter: {
                    accessToken: {
                        appKey: CONSUMER_KEY,
                        appSecret: CONSUMER_SECRET,
                        accessToken: ACCESS_TOKEN,
                        accessSecret: ACCESS_SECRET
                    }
                }
            },
            body: {
                tweet: [
                    { text: 'another test tweet' }
                ]
            },

        })

        const response = httpMocks.createResponse();

        await sendTweet(request, response, () => { })
        expect(response.statusCode).to.eql(200)
        let tweet_id = JSON.parse(request.announcementID)
        await sendTweet(request, response, () => { })
        expect(response.statusCode).to.eql(441)

        // delete the tweet
        let deleted = await twitter_delete_tweet(request.session.twitter.accessToken, tweet_id)
        expect(deleted).to.equal(true);

    })

    done()

})


// empty tweet

// tweet with media