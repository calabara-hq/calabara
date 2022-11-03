const httpMocks = require('node-mocks-http')
const { poll_auth_status } = require('../../middlewares/twitter-middleware');
const { expect } = require('chai')


const CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY
const CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET
const ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN_KEY
const ACCESS_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET


describe('poll auth state', async (done) => {


    it('empty session', async () => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            session: {}
        })

        const response = httpMocks.createResponse();

        await poll_auth_status(request, response, () => { })
        expect(response.statusCode).to.eql(200)
        const data = response._getData()
        expect(data.status).to.eql('error')

    })


    it('polling time out', async () => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            session: {
                twitter: {
                    retries: 20
                }
            }
        })

        const response = httpMocks.createResponse();

        await poll_auth_status(request, response, () => { })
        expect(response.statusCode).to.eql(200)
        const data = response._getData()
        expect(data.status).to.eql('error')

    })

    it('undefined code', async () => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            session: {
                twitter: {
                    codeVerifier: '123',
                    stateVerifier: 'abc',
                    state: 'xyz'
                }
            }
        })

        const response = httpMocks.createResponse();

        await poll_auth_status(request, response, () => { })
        expect(response.statusCode).to.eql(200)
        const data = response._getData()
        expect(data.status).to.eql('error')

    })


    it('fail state verification', async () => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            session: {
                twitter: {
                    codeVerifier: '123',
                    stateVerifier: 'abc',
                    code: '12345',
                    state: 'xyz'
                }
            }
        })

        const response = httpMocks.createResponse();

        await poll_auth_status(request, response, () => { })
        expect(response.statusCode).to.eql(200)
        const data = response._getData()
        expect(data.status).to.eql('error')

    })


    it('pending state', async () => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            session: {
                twitter: {
                    codeVerifier: '123',
                    stateVerifier: 'abc',
                    code: '12345',
                    state: 'abc'
                }
            }
        })

        const response = httpMocks.createResponse();

        await poll_auth_status(request, response, () => { })
        expect(response.statusCode).to.eql(200)
        const data = response._getData()
        expect(data.status).to.eql('pending')

    })


    it('access token with invalid state', async () => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            session: {
                twitter: {
                    codeVerifier: '123',
                    stateVerifier: 'abc',
                    code: '12345',
                    state: 'xyz',
                    accessToken: '123'
                }
            }
        })

        const response = httpMocks.createResponse();

        await poll_auth_status(request, response, () => { })
        expect(response.statusCode).to.eql(200)
        const data = response._getData()
        expect(data.status).to.eql('error')

    })

    it('invalid access token', async () => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            session: {
                twitter: {
                    codeVerifier: '123',
                    stateVerifier: 'abc',
                    code: '12345',
                    state: 'abc',
                    accessToken: '123'
                }
            }
        })

        const response = httpMocks.createResponse();

        await poll_auth_status(request, response, () => { })
        expect(response.statusCode).to.eql(200)
        const data = response._getData()
        expect(data.status).to.eql('error')

    })

    it('valid access token', async () => {

        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/test/mock_route',
            session: {
                twitter: {
                    codeVerifier: '123',
                    stateVerifier: 'abc',
                    code: '12345',
                    state: 'abc',
                    accessToken: {
                        appKey: CONSUMER_KEY,
                        appSecret: CONSUMER_SECRET,
                        accessToken: ACCESS_TOKEN,
                        accessSecret: ACCESS_SECRET
                    }
                },
                user: {
                    address: '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C'
                }
            }
        })

        const response = httpMocks.createResponse();

        await poll_auth_status(request, response, () => { })
        expect(response.statusCode).to.eql(200)
        const data = response._getData()
        expect(data.status).to.eql('ready')
        expect(request.session.twitter.user).to.have.property('id')

    })

    done()
})