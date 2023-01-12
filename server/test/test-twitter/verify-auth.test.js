const httpMocks = require('node-mocks-http')
const { sendTweet, sendQuoteTweet, convertTweet, verifyTwitterAuth } = require('../../middlewares/twitter-middleware');
const { expect } = require('chai')

const CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY
const CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET
const ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN_KEY
const ACCESS_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET


describe('verify twitter auth middleware', async (done) => {


    it('null access token', async () => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            session: {}
        })

        const response = httpMocks.createResponse();

        await verifyTwitterAuth(request, response, () => { })
        expect(response.statusCode).to.eql(440)

    })


    it('invalid access token', async () => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            session: {
                twitter: {
                    accessToken: '123'
                }
            }
        })

        const response = httpMocks.createResponse();

        await verifyTwitterAuth(request, response, () => { })

        expect(response.statusCode).to.eql(440)

    })



    it('simulated access token', async () => {
        // use app only access to simulate logged client

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
            }
        })

        const response = httpMocks.createResponse();

        await verifyTwitterAuth(request, response, () => { })
        expect(response.statusCode).to.eql(200)

    })

    done()
})
