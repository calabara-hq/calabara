const { expect } = require('chai');
const request = require('supertest')
const https = require('https');
let settings = require('./dummy-settings.test')
const app = require('../server');
const fs = require('fs');
const { checkWalletTokenBalance } = require('../web3/web3')

let walletAddress = '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C'
let jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHhlZGNDODY3YmM4QjVGRUJkMDQ1OWFmMTdhNmYxMzRGNDFmNDIyZjBDIiwiaWF0IjoxNjYyMDUzMTgxLCJleHAiOjE2NjIwNTUzNDF9.U1VHjM3xy8NBexmBelwXSCIk1wS0bVElO6ooxKBryVQ'



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


const createDummyContest = async (index, mock_settings) => {
    let response = await request(secureServer)
        .post('/creator_contests/create_contest')
        .send({ ens: 'dev_testing.eth', contest_settings: mock_settings })
        .trustLocalhost()
    return response
}

const fetchDummyContest = async (index) => {
    let response = await request(secureServer)
        .get('/creator_contests/fetch_org_contests/dev_testing.eth')
        .trustLocalhost()
    return response
}

const createDummySubmission = async (index, contest_hash) => {
    let response = await request(secureServer)
        .post('/creator_contests/test_create_submission')
        .send({ ens: 'dev_testing.eth', contest_hash: contest_hash })
        .trustLocalhost()
    return response
}

const fetchVotingMetrics = async (index, contest_hash, submission_id) => {
    let response = await request(secureServer)
        .post('/creator_contests/user_voting_metrics')
        .send({ ens: 'dev_testing.eth', contest_hash: contest_hash, sub_id: submission_id, walletAddress: walletAddress })
        .trustLocalhost()
    return response
}

const castDummyVote = async (index, contest_hash, submission_id, num_votes) => {
    let response = await request(secureServer)
        .post('/creator_contests/cast_vote')
        .set('Authorization', `Bearer ${jwt}`)
        .send({ ens: 'dev_testing.eth', contest_hash: contest_hash, sub_id: submission_id, num_votes: num_votes })
        .trustLocalhost()
    if (response.status === 401) {
        console.error('are you sure the jwt provided is not expired?')
    }
    return response
}


before(done => {
    console.log('RUNNING THIS')
    initializeServer()
        .on('app_started', () => {
            done();
        })
})


after(done => {

    request(secureServer)
        .post('/creator_contests/test_delete_dummy')
        .trustLocalhost()
        .then(response => { expect(response.status).to.eql(200) })
        .then(() => {
            return secureServer.close(done);
        })

})


module.exports = { createDummyContest, fetchDummyContest, createDummySubmission, fetchVotingMetrics, castDummyVote }