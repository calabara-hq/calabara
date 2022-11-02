const httpMocks = require('node-mocks-http')
const { sendQuoteTweet } = require('../../middlewares/twitter-middleware');
const { expect } = require('chai');
const { TwitterApi } = require('twitter-api-v2');
const { twitter_delete_tweet } = require('../../twitter-client/helpers')

const CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY
const CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET
const ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN_KEY
const ACCESS_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET

describe('quote tweet', async (done) => {


    it('null access token', async () => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            session: {}
        })

        const response = httpMocks.createResponse();

        await sendQuoteTweet(request, response, () => { })
        expect(response.statusCode).to.eql(440)

    })


    it('null announcementID', async () => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            session: {
                twitter: { accessToken: '123' }
            }
        })

        const response = httpMocks.createResponse();

        await sendQuoteTweet(request, response, () => { })
        expect(response.statusCode).to.eql(400)

    })


    it('bad accessToken', async () => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            session: {
                twitter: { accessToken: '123' }
            },
            body: {
                tweet: [
                    { text: 'tweet1' }
                ]
            },
            announcementID: '123'

        })

        const response = httpMocks.createResponse();

        await sendQuoteTweet(request, response, () => { })
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
                    { text: 'tweet2' }
                ]
            },
            announcementID: '1573694758773559297'

        })

        const response = httpMocks.createResponse();

        await sendQuoteTweet(request, response, () => { })
        expect(response.statusCode).to.eql(200)
        let tweet_id = JSON.parse(request.tweet_id)
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
                    { text: 'tweet3' }
                ]
            },
            announcementID: '1573694758773559297'

        })

        const response = httpMocks.createResponse();

        await sendQuoteTweet(request, response, () => { })
        expect(response.statusCode).to.eql(200)
        let tweet_id = JSON.parse(request.tweet_id)
        
        //duplicate should fail
        await sendQuoteTweet(request, response, () => { })
        expect(response.statusCode).to.eql(441)
        // delete the tweet
        let deleted = await twitter_delete_tweet(request.session.twitter.accessToken, tweet_id)
        expect(deleted).to.equal(true);
    })


    done()

})