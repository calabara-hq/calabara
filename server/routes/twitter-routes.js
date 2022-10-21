const { TwitterApi } = require('twitter-api-v2')
const { requestClient } = require('../twitter-client/config');
const express = require('express');
const dotenv = require('dotenv')
const twitter = express();
const db = require('../helpers/db-init')
const { authenticateToken } = require('../middlewares/auth-middleware');
const { sendTweet, sendQuoteTweet } = require('../middlewares/twitter-middleware');
twitter.use(express.json())



dotenv.config()


/**
 * @var codeVerifier private code
 * @var stateVerifier private state
 * @var code public code
 * @var state public state
 */


let scopes = {
    privileged: ['tweet.read', 'users.read', 'tweet.write'],
    standard: ['tweet.read', 'users.read']
}



twitter.post('/generateAuthLink', authenticateToken, async function (req, res, next) {
    const { scope_type } = req.body

    console.log(scope_type)

    const { url, codeVerifier, state } = requestClient.generateOAuth2AuthLink('https://localhost:3001/twitter/oauth2', { scope: scopes[scope_type] });
    req.session.twitter = {
        codeVerifier: codeVerifier,
        stateVerifier: state,
    }
    res.send(url).status(200)

})

/**
 * local to oauth popup window
 * set session vars from twitter oauth get request
 * try to login and close window
 * handle the status in poll_auth_status
 * 
 *  */

twitter.get('/oauth2', authenticateToken, async function (req, res, next) {
    const { state, code } = req.query;
    req.session.twitter.state = state;
    req.session.twitter.code = code;
    req.session.twitter.retries = 0;

    const { codeVerifier, stateVerifier, accessToken, refreshToken, expiresIn } = req.session.twitter;

    if ((!codeVerifier || !state || !stateVerifier || !code) || (state != stateVerifier)) {
        return res.status(200).send('<script>window.close()</script>')
    }


    requestClient.loginWithOAuth2({ code, codeVerifier, redirectUri: 'https://localhost:3001/twitter/oauth2' })
        .then(async ({ client: loggedClient, accessToken, refreshToken, expiresIn }) => {

            req.session.twitter.accessToken = accessToken
            req.session.twitter.refreshToken = refreshToken
            req.session.twitter.expiresIn = expiresIn

            // Example request
            const { data: userObject } = await loggedClient.v2.me();
            return res.status(200).send('<script>window.close()</script>')
        })
        .catch((err) => {
            res.status(200).send('<script>window.close()</script>')
        });

})


// keep track of the user account for future reference
const update_user_twitter = async (address, data) => {
    return db.query('insert into users (address, twitter) values ($1, $2) on conflict (address) do update set twitter = $2', [address, data])
        .catch(err => console.log(err))
}


twitter.get('/poll_auth_status', authenticateToken, async function (req, res, next) {
    const { codeVerifier, stateVerifier, state, code, accessToken, retries } = req.session.twitter;
    req.session.twitter.retries = retries + 1
    console.log(req.session.twitter)

    // there was an error in the oauth process

    if (retries > 20) {
        return res.send({ status: 'error' }).status(200)
    }


    if (codeVerifier && stateVerifier && state && code) {
        if (stateVerifier !== state) return res.send({ status: 'error' }).status(200)
    }

    // if the user refuses app access, code will not be provided
    if (codeVerifier && stateVerifier && state && !code) {
        return res.send({ status: 'error' }).status(200)
    }

    if (codeVerifier && stateVerifier && !accessToken) {
        // user got the auth link but hasn't yet approved the authorization
        return res.send(JSON.stringify({ status: 'pending' })).status(200)
    }

    if (accessToken) {
        if (state !== stateVerifier) return res.send({ status: 'error', extra: 'came from here' }).status(200)

        const client = new TwitterApi(accessToken);
        const { data: user } = await client.v2.me({ "user.fields": ["profile_image_url"] });
        req.session.twitter.user = user
        update_user_twitter(req.session.user.address, user)
        res.send(JSON.stringify({ status: 'ready', user }))
    }
})



// 403 error -> tweet with duplicate content
// 


// parse the thread
// send the tweet
// on success,
// parse the thread into a calabara submission
// submit in the contest

twitter.post('/sendQuoteTweet', authenticateToken, sendQuoteTweet, async function (req, res, next) {

    res.sendStatus(200)
})



twitter.get('/destroy_session', async function (req, res, next) {
    req.session.twitter = null
    res.sendStatus(200)
})







module.exports = { twitter }