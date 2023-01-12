
const { expect } = require('chai');
const { getTwitterAuthLink } = require('../master.test')





describe('twitter oauth2 url generation', () => {
    it('link with write scope', async () => {
        let url = await getTwitterAuthLink('privileged')
        expect(url.status).to.eql(200)
        let queryString = new URLSearchParams(url.text)
        let scope = queryString.get('scope')
        let redirectUri = queryString.get('redirect_uri')

        expect(scope).to.eql('tweet.read users.read tweet.write')
        expect(redirectUri).to.eql('https://192.168.1.224:3001/twitter/oauth2')
    })

    it('link with standard scope', async () => {
        let url = await getTwitterAuthLink('standard')
        let queryString = new URLSearchParams(url.text)
        expect(url.status).to.eql(200)
        let scope = queryString.get('scope')
        let redirectUri = queryString.get('redirect_uri')

        expect(scope).to.eql('tweet.read users.read')
        expect(redirectUri).to.eql('https://192.168.1.224:3001/twitter/oauth2')
    })

    it('link with null scope', async () => {
        let url = await getTwitterAuthLink()
        expect(url.status).to.eql(400)
    })

    it('link with non-supported scope', async () => {
        let url = await getTwitterAuthLink('random')
        expect(url.status).to.eql(400)
    })
})