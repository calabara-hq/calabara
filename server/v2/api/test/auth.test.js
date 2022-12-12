const { expect } = require('chai');
const { cleanup, getRequest, postRequest, sessionRequest } = require('./setup.test')

describe('• auth tests', async (done) => {
    it('• generate nonce', async () => {
        // with address
        let res_1 = await postRequest('/authentication/generate_nonce', { address: '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C' })
            .then(data => data.body)
        expect(res_1.nonce.length).to.eql(25)
        // without address
        let res_2 = await postRequest('/authentication/generate_nonce')
        expect(res_2.status).to.eql(400)
    })

    it('• generate session', async () => {

        let message = {
            domain: 'localhost:3000',
            address: '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C',
            statement: 'Sign in with Ethereum to the app.',
            uri: 'https://localhost:3000',
            version: '1',
            chainId: 1,
            nonce: 'EzWlNPvyJVjjzrM4NSkZ6wsJg',
            issuedAt: '2022-12-08T18:34:08.462Z'
        }

        let signature = '0x31d811d04d7d17a7e2ea736bd02d514ad147b7b149737e9cd98abd8dc4ea9a2065b077a235ef26773317559ab3d7f940865de21a4fe8972191c72bd004f8bb511b'
        let res_1 = await postRequest('/authentication/generate_session', { message: message, signature: signature })
            .then(data => data.body)

        let res_2 = await postRequest('/authentication/generate_session', { message: Object.assign(message, { address: '0x123' }), signature: signature })
        expect(res_2.status).to.eql(401)

        let res_3 = await postRequest('/authentication/generate_session', { message: message, signature: null })
        expect(res_3.status).to.eql(401)

        let res_4 = await postRequest('/authentication/generate_session', { message: null, signature: signature })
        expect(res_4.status).to.eql(401)
    })

    done();
})
