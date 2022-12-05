const httpMocks = require('node-mocks-http')
const { sendTweet, sendQuoteTweet, convertTweet, verifyTwitterAuth } = require('../../middlewares/twitter-middleware');
const { fetch_quote_tweets } = require('../../twitter-client/helpers')
const { expect } = require('chai')

describe('test convert tweet middleware', async (done) => {


    it('fetch QTs', async () => {

        let quotes = await (fetch_quote_tweets('1599041010516066305'));
        for await (const quote of quotes) {
            console.log('from pull tweets')
            console.log(quote)
        }

    })
    done()
})