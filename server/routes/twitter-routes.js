const { TwitterApi } = require('twitter-api-v2')
const { requestClient } = require('../twitter-client/config');
const express = require('express');
const dotenv = require('dotenv')
const twitter = express();
twitter.use(express.json())


dotenv.config()


twitter.get('/generateAuthLink', async function (req, res, next) {
    const { url, codeVerifier, state } = await requestClient.generateOAuth2AuthLink('https://localhost:3001/twitter/oauth2', { scope: ['tweet.read', 'users.read', 'tweet.write'] });
    req.session.codeVerifier = codeVerifier;
    req.session.state = state
    res.send(url).status(200)
})





twitter.get('/oauth2', async function (req, res, next) {
    console.log('entering oauth2')
    const { state, code } = req.query;

    const { codeVerifier, state: sessionState, accessToken, refreshToken, expiresIn } = req.session;

    if (!codeVerifier || !state || !sessionState || !code) return res.status(400).send('denied the authentication or session expired')

    if (state !== sessionState) return res.status(400).send('Stored tokens didnt match!')


    requestClient.loginWithOAuth2({ code: code, codeVerifier: codeVerifier, redirectUri: 'https://localhost:3001/twitter/oauth2' })
        .then(async ({ client: loggedClient, accessToken, refreshToken, expiresIn }) => {
            // {loggedClient} is an authenticated client in behalf of some user
            // Store {accessToken} somewhere, it will be valid until {expiresIn} is hit.
            // If you want to refresh your token later, store {refreshToken} (it is present if 'offline.access' has been given as scope)
            req.session.accessToken = accessToken
            req.session.refreshToken = refreshToken
            req.sessionStore.expiresIn = expiresIn
            // Example request
            const { data: userObject } = await loggedClient.v2.me();
            res.status(200).send('<script>window.close()</script>')
        })
        .catch(() => res.status(403).send('Invalid verifier or access tokens!'));

})


twitter.get('/poll_auth_status', async function (req, res, next) {
    const { codeVerifier, state: sessionState, accessToken, refreshToken, expiresIn } = req.session;
    
    if(codeVerifier && !accessToken){
        // user got the auth link but hasn't yet approved the authorization
        res.send(JSON.stringify({authorized: false})).status(200)
    }

    if(codeVerifier && accessToken){
        const client = new TwitterApi(accessToken);
        const {data: user} = await client.v2.me({"user.fields": ["profile_image_url"]});
        res.send(JSON.stringify({authorized: true, user}))
    }
})


module.exports = { twitter }