const { expect } = require('chai');
const request = require('supertest')
const https = require('https');
const app = require('../server.js')
const fs = require('fs');

let walletAddress_main = '0xe9ad38d6E38E0A9970D6ebEc84C73DEA3e025da1'
let walletAddress_alt = '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C'



const initializeServer = () => {
    let key = fs.readFileSync("localhost.key", "utf-8");
    let cert = fs.readFileSync("localhost.cert", "utf-8");

    secureServer = https.createServer({ key, cert }, app);
    return secureServer.listen(3002, () => {
        secureServer.emit('app_started')
    })
}


const createDummyContest = async (mock_settings) => {
    let response = await request(secureServer)
        .post('/creator_contests/create_contest')
        .send({ ens: 'dev_testing.eth', contest_settings: mock_settings })
        .trustLocalhost()
    return response
}

const fetchDummyContest = async () => {
    let response = await request(secureServer)
        .get('/creator_contests/fetch_org_contests/dev_testing.eth')
        .trustLocalhost()
    return response
}

// used to populate contest with a sub
// use alt address so we dont have to worry about self voting param when we don't want to test it
const createDummySubmission = async (contest_hash, custom_auth) => {
    let response = await request(secureServer)
        .post('/creator_contests/test_create_submission')
        .send({ ens: 'dev_testing.eth', contest_hash: contest_hash, author: custom_auth ? custom_auth : walletAddress_alt })
        .trustLocalhost()
    return response
}

// used to actually test submitting
const createRealSubmission = async (contest_hash) => {
    let submission = { tldr_text: null, tldr_image: null, submission_body: null }
    let response = await request(secureServer)
        .post('/creator_contests/create_submission')
        .send({ ens: 'dev_testing.eth', contest_hash: contest_hash, submission: submission })
        .trustLocalhost()
    return response
}

const fetchSubmissions = async (contest_hash) => {
    let response = await request(secureServer)
        .get(`/creator_contests/fetch_submissions?ens=dev_testing.eth&contest_hash=${contest_hash}`)
        .trustLocalhost()
    return response
}

const fetchVotingMetrics = async (contest_hash, submission_id) => {
    let response = await request(secureServer)
        .post('/creator_contests/user_voting_metrics')
        .send({ ens: 'dev_testing.eth', contest_hash: contest_hash, sub_id: submission_id, walletAddress: walletAddress_main })
        .trustLocalhost()
    return response
}

const castDummyVote = async (contest_hash, submission_id, num_votes) => {
    let response = await request(secureServer)
        .post('/creator_contests/cast_vote')
        .send({ ens: 'dev_testing.eth', contest_hash: contest_hash, sub_id: submission_id, num_votes: num_votes })
        .trustLocalhost()
    return response
}

const cleanup = async () => {
    let response = await request(secureServer)
        .post('/creator_contests/test_delete_dummy')
        .trustLocalhost()
    return response
}


before(done => {
    initializeServer()
        .on('app_started', () => {
            done();
        })
})


after(done => {

    cleanup()
        .then(() => {
            console.log('CLOSING SERVER')
            return secureServer.close(done);
        })

})


module.exports = { createDummyContest, fetchDummyContest, createDummySubmission, createRealSubmission, fetchVotingMetrics, castDummyVote, fetchSubmissions, cleanup }