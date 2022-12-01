const { requestClient } = require('../twitter-client/config');
const express = require('express');
const dotenv = require('dotenv')
const twitter = express();
const db = require('../helpers/db-init')
const { authenticateToken } = require('../middlewares/auth-middleware');
const { sendTweet, sendQuoteTweet, convertTweet, verifyTwitterAuth, verifyTwitterContest } = require('../middlewares/twitter-middleware');
const { check_submitter_eligibility_PROTECTED, createSubmission } = require('../middlewares/creator-contests/submit-middleware');
const { clean } = require('../helpers/common');
const { socketSendNewSubmission, socketSendUserSubmissionStatus, socketSendUserTwitterAuthStatus } = require('../helpers/socket-messages');
const { isAdmin } = require('../middlewares/admin-middleware');
const logger = require('../logger').child({ service: 'twitter_api' })
const path = require('path');
const session = require('express-session');
twitter.use(express.json())

dotenv.config()

let twitter_redirect = process.env.NODE_ENV === 'production' ? "https://calabara.com/twitter/oauth2" : "https://192.168.1.224:3001/twitter/oauth2"

const successful_redirect = '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Ubuntu"><html style="width: 100vw; height: 100vh; background-color: rgb(20, 20, 22); font-family: Ubuntu,sans,sans-serif"><body style="width: 100vw; height: 100vh;"><div style="height: 100vh; width: 100vw; display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center;"><p style="font-size: 80px; color: rgb(211, 211, 211);">Successfully linked your account ✅</p><p style="font-size: 50px; color: grey;">Please close this window</p></div></html></body>'
const failed_redirect = '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Ubuntu"><html style="width: 100vw; height: 100vh; background-color: rgb(20, 20, 22); font-family: Ubuntu,sans,sans-serif"><body style="width: 100vw; height: 100vh;"><div style="height: 100vh; width: 100vw; display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center;"><p style="font-size: 80px; color: rgb(211, 211, 211);">There was a problem linking your account 😕</p><p style="font-size: 50px; color: grey;">Please close this window and try again</p></div></html></body>'

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


// keep track of the user account for future reference
const update_user_twitter = async (address, data) => {
    // flush the db of any addresses linked to this same twitter account. Want only 1 twitter linked to 1 address at a time (for now)

    await db.query('update users set twitter = null where twitter->>\'id\' = $1', [data.id])
    return db.query('insert into users (address, twitter) values ($1, $2) on conflict (address) do update set twitter = $2', [address, data])
        .catch(err => {
            logger.log({ level: 'error', message: `udpate user twitter failed with error: ${err}` })
        })
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
    console.log('session from link', req.sessionID, req.session, 'end')
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
 *  */

/**
 * There are known issues with twitter Oauth2 on mobile devices see here: https://twittercommunity.com/t/web-oauth-2-0-is-broken-on-android-if-twitter-app-is-installed/169698
 * basically, user session gets destroyed on mobile twitter auth
 * to overcome this, we need to match the originial session with a new undefined session via the stateVerifier
 * during the auth process, we'll then update the original user session
 */


// begin patch 
const processTwitterSession = async (req, state, code) => {
    console.log('session in process', req.sessionID, req.session, 'end')
    if (!(req.sessionID && req.session.user)) {
        let sess = await db.query('select sid, sess->\'user\' as user_session, sess->\'twitter\' as twitter_session from session where (sess->>\'twitter\')::json->>\'stateVerifier\' = $1', [state])
            .then(clean)
        return { sid: sess.sid, userAddress: sess.user_session.address, stateVerifier: sess.twitter_session.stateVerifier, codeVerifier: sess.twitter_session.codeVerifier }
    }
    else {
        return { sid: req.sessionID, userAddress: req.session.user?.address, stateVerifier: req.session.twitter?.stateVerifier, codeVerifier: req.session.twitter?.codeVerifier }
    }
}

const updateTwitterSession = async (data, sid) => {
    try {
        return await db.query('update session set sess = jsonb_set(sess::jsonb, \'{twitter}\', (sess->>\'twitter\')::jsonb || $1) where sid = $2', [data, sid])
    } catch (e) { console.log(e) }
}

// end patch

twitter.get('/oauth2', async function (req, res, next) {
    const { state, code } = req.query;
    console.log('session in oauth2', req.sessionID, req.session, 'end')
    let patched_session = await processTwitterSession(req, state, code)

    let query_params = {
        state: state,
        code: code,
        retries: 0,

    }

    const { codeVerifier, stateVerifier } = patched_session;

    if ((!codeVerifier || !state || !stateVerifier || !code) || (state != stateVerifier)) {
        socketSendUserTwitterAuthStatus(patched_session.userAddress, { status: 'failed' })
        return res.status(200).send(`${failed_redirect}<script>window.close()</script>`)
    }


    return requestClient.loginWithOAuth2({ code, codeVerifier, redirectUri: twitter_redirect })
        .then(async ({ client: loggedClient, accessToken, refreshToken, expiresIn }) => {

            let client_params = {
                accessToken: accessToken,
                refreshToken: refreshToken,
                expiresIn: expiresIn
            }

            // Example request
            const { data: user } = await loggedClient.v2.me({ "user.fields": ["profile_image_url"] });

            let twitter_auth_session = JSON.stringify({ ...query_params, ...client_params, ...{ user: user } })

            updateTwitterSession(twitter_auth_session, patched_session.sid)
            update_user_twitter(patched_session.userAddress, user)
            socketSendUserTwitterAuthStatus(patched_session.userAddress, { status: 'success', data: user })
            logger.log({ level: 'info', message: `twitter auth suceeded` })
            return res.status(200).send(`${successful_redirect}<script>window.close()</script>`)
        })
        .catch((err) => {
            socketSendUserTwitterAuthStatus(patched_session.userAddress, { status: 'failed' })
            logger.log({ level: 'error', message: `twitter auth failed with error: ${err}` })
            return res.status(200).send(`${failed_redirect}<script>window.close()</script>`)
        });

})



twitter.post('/sendQuoteTweet', authenticateToken, check_submitter_eligibility_PROTECTED, verifyTwitterContest, sendQuoteTweet, convertTweet, createSubmission, async function (req, res, next) {
    const { ens } = req.body
    let meta_data = { tweet_id: req.tweet_id }

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




module.exports = { twitter }
