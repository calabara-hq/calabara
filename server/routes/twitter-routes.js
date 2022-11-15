const { TwitterApi } = require('twitter-api-v2')
const { requestClient } = require('../twitter-client/config');
const express = require('express');
const dotenv = require('dotenv')
const twitter = express();
const db = require('../helpers/db-init')
const { authenticateToken } = require('../middlewares/auth-middleware');
const { sendTweet, sendQuoteTweet, convertTweet, verifyTwitterAuth, poll_auth_status, verifyTwitterContest } = require('../middlewares/twitter-middleware');
const { check_submitter_eligibility_PROTECTED, createSubmission } = require('../middlewares/creator-contests/submit-middleware');
const { clean } = require('../helpers/common');
const { socketSendNewSubmission, socketSendUserSubmissionStatus } = require('../helpers/socket-messages');
const { isAdmin } = require('../middlewares/admin-middleware');
const logger = require('../logger').child({ service: 'twitter_api' })
twitter.use(express.json())

dotenv.config()

let twitter_redirect = process.env.NODE_ENV === 'production' ? "https://calabara.com/twitter/oauth2" : "https://localhost:3001/twitter/oauth2"


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
    if (!scope_type) {
        logger.log({ level: 'error', message: 'scope not passed for twitter auth link generation' })
        return res.sendStatus(400)
    }
    if (!scopes[scope_type]) {
        logger.log({ level: 'error', message: 'invalid scope passed for twitter auth link generation' })
        return res.sendStatus(400)
    }
    const { url, codeVerifier, state } = requestClient.generateOAuth2AuthLink(twitter_redirect, { scope: scopes[scope_type] });
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

/**
 * There are known issues with twitter Oauth2 on mobile devices see here: https://twittercommunity.com/t/web-oauth-2-0-is-broken-on-android-if-twitter-app-is-installed/169698
 */

twitter.get('/oauth2', authenticateToken, async function (req, res, next) {
    const { state, code } = req.query;
    req.session.twitter.state = state;
    req.session.twitter.code = code;
    req.session.twitter.retries = 0;

    const { codeVerifier, stateVerifier, accessToken, refreshToken, expiresIn } = req.session.twitter;

    if ((!codeVerifier || !state || !stateVerifier || !code) || (state != stateVerifier)) {
        return res.status(200).send('<script>window.close()</script>')
    }


    requestClient.loginWithOAuth2({ code, codeVerifier, redirectUri: twitter_redirect })
        .then(async ({ client: loggedClient, accessToken, refreshToken, expiresIn }) => {

            req.session.twitter.accessToken = accessToken
            req.session.twitter.refreshToken = refreshToken
            req.session.twitter.expiresIn = expiresIn

            // Example request
            const { data: userObject } = await loggedClient.v2.me();
            logger.log({ level: 'info', message: `twitter auth suceeded` })
            return res.status(200).send('<script>window.close()</script>')
        })
        .catch((err) => {
            logger.log({ level: 'error', message: `twitter auth failed with error: ${err}` })
            return res.status(200).send('<script>window.close()</script>')
        });

})



twitter.get('/poll_auth_status', authenticateToken, poll_auth_status)


twitter.post('/sendQuoteTweet', authenticateToken, check_submitter_eligibility_PROTECTED, verifyTwitterContest, sendQuoteTweet, convertTweet, createSubmission, async function (req, res, next) {
    const { ens } = req.body
    let meta_data = { tweet_id: req.tweet_id }
    console.log(req.tweet_id)
    //res.sendStatus(442) // TEMPORARY

    let result = await db.query('insert into contest_submissions (ens, contest_hash, author, created, locked, pinned, _url, meta_data) values ($1, $2, $3, $4, $5, $6, $7, $8) returning id ', [ens, req.contest_hash, req.session.user.address, req.created, false, false, req.url, { tweet_id: JSON.parse(req.tweet_id) }]).then(clean)
    res.sendStatus(200)
    logger.log({ level: 'info', message: `successfully processed platform twitter submission` })
    socketSendNewSubmission(req.contest_hash, ens, { id: result.id, _url: req.url, author: req.session.user.address, votes: 0 })
    socketSendUserSubmissionStatus(req.session.user.address, req.contest_hash, 'submitted')
})

// attempt to tweet, then return the announcementID
twitter.post('/send_announcement_tweet', authenticateToken, isAdmin, sendTweet, async function (req, res, next) {
    logger.log({ level: 'info', message: `successfully processed announcement tweet with ID: ${req.announcementID}` })
    res.send(req.announcementID).status(200)
})

twitter.post('/verify_twitter_auth', authenticateToken, verifyTwitterAuth, async function (req, res, next) {
    res.sendStatus(200)
})

twitter.get('/destroy_session', async function (req, res, next) {
    req.session.twitter = null
    res.sendStatus(200)
})


twitter.get('/user_account', authenticateToken, async function (req, res, next) {
    let data = await db.query('select twitter from users where address = $1', [req.session.user.address])
        .then(clean)
    res.send(data).status(200)
})


twitter.post('/generate_quote_intent', verifyTwitterContest, async function (req, res, next) {
    res.send(`https://twitter.com/i/web/status/${req.announcementID}`).status(200)
})



module.exports = { twitter }
