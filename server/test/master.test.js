const { expect } = require('chai');
const request = require('supertest')
const https = require('https');
let settings = require('./dummy-settings.test')
const app = require('../server.js')
const fs = require('fs');
const { checkWalletTokenBalance } = require('../web3/web3')

let walletAddress = '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C'



const initializeServer = () => {
    let key = fs.readFileSync("localhost.key", "utf-8");
    let cert = fs.readFileSync("localhost.cert", "utf-8");
    app._router.stack.splice(7, 1) // remove discord route
    app._router.stack.splice(9, 1) // remove dashboard route
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

const createDummySubmission = async (contest_hash) => {
    let response = await request(secureServer)
        .post('/creator_contests/test_create_submission')
        .send({ ens: 'dev_testing.eth', contest_hash: contest_hash, author: walletAddress })
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
        .send({ ens: 'dev_testing.eth', contest_hash: contest_hash, sub_id: submission_id, walletAddress: walletAddress })
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


module.exports = { createDummyContest, fetchDummyContest, createDummySubmission, fetchVotingMetrics, castDummyVote, fetchSubmissions, cleanup }