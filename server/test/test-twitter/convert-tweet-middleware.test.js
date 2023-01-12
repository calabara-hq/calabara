const httpMocks = require('node-mocks-http')
const { sendTweet, sendQuoteTweet, convertTweet, verifyTwitterAuth } = require('../../middlewares/twitter-middleware');
const { expect } = require('chai')

describe('test convert tweet middleware', async (done) => {


    it('convert single tweet no media', async () => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            body: { tweet: [{ text: 'hello' }] }
        })

        const response = httpMocks.createResponse();

        convertTweet(request, response);
        let converted = { ...request.body.submission }
        expect(converted.tldr_text).to.eql('hello')
        expect(converted.submission_body).to.eql(null)

    })

    it('convert single tweet with media', async () => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            body: { tweet: [{ text: 'hello', media: { media_ids: ['123'], url: 'xyz.com' } }] }
        })

        const response = httpMocks.createResponse();

        convertTweet(request, response);
        let converted = { ...request.body.submission }
        expect(converted.tldr_text).to.eql('hello')
        expect(converted.tldr_image).to.eql('xyz.com')
        expect(converted.submission_body).to.eql(null)

    })


    it('convert thread no media', async () => {


        const thread = [
            { text: 'tweet1' },
            { text: 'tweet2' },
            { text: 'tweet3' },
        ]


        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            body: { tweet: thread }
        })

        const response = httpMocks.createResponse();


        convertTweet(request, response)
        let converted = { ...request.body.submission }
        expect(converted.tldr_text).to.eql('tweet1')
        expect(converted.submission_body.blocks.length).to.eql(2)
        expect(converted.submission_body.blocks[0].type).to.eql('paragraph')
        expect(converted.submission_body.blocks[1].type).to.eql('paragraph')

    })


    it('convert thread with media', async () => {


        const thread = [
            { text: 'tweet1', media: { media_ids: ['123'], url: '123.com' } },
            { text: 'tweet2', media: { media_ids: ['abc'], url: 'abc.com' } },
            { text: 'tweet3', media: { media_ids: ['xyz'], url: 'xyz.com' } },
        ]

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            body: { tweet: thread }
        })

        const response = httpMocks.createResponse();


        convertTweet(request, response)
        let converted = { ...request.body.submission }
        expect(converted.tldr_text).to.eql('tweet1')
        expect(converted.tldr_image).to.eql('123.com')
        expect(converted.submission_body.blocks.length).to.eql(4)
        expect(converted.submission_body.blocks[0].type).to.eql('paragraph')
        expect(converted.submission_body.blocks[0].data.text).to.eql('tweet2')

        expect(converted.submission_body.blocks[1].type).to.eql('image')
        expect(converted.submission_body.blocks[1].data.file.url).to.eql('abc.com')

        expect(converted.submission_body.blocks[2].type).to.eql('paragraph')
        expect(converted.submission_body.blocks[2].data.text).to.eql('tweet3')

        expect(converted.submission_body.blocks[3].type).to.eql('image')
        expect(converted.submission_body.blocks[3].data.file.url).to.eql('xyz.com')



    })

    done()
})