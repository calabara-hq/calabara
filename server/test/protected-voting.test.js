const { expect } = require('chai');
let settings = require('./dummy-settings.test')
const { createDummyContest, fetchDummyContest, createDummySubmission, fetchVotingMetrics, castDummyVote } = require('./master.test');

let voter_restrictions = [
    // restriction setup 1
    {
        0: {
            type: 'erc20',
            symbol: 'SHARK',
            address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
            decimal: 0,
            threshold: 1
        },
        1: {
            type: 'erc721',
            symbol: 'NOUN',
            address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
            decimal: 0,
            threshold: 2
        },
        2: {
            type: 'erc721',
            symbol: 'MFER',
            address: '0x79FCDEF22feeD20eDDacbB2587640e45491b757f',
            decimal: 0,
            threshold: 3
        }
    },

    // restriction setup 2
    {
        0: {
            type: 'erc721',
            symbol: 'NOUN',
            address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
            decimal: 0,
            threshold: 2
        },
        1: {
            type: 'erc721',
            symbol: 'MFER',
            address: '0x79FCDEF22feeD20eDDacbB2587640e45491b757f',
            decimal: 0,
            threshold: 3
        }
    }

]

let voting_strategies = [

    {
        strategy_type: 'token',
        type: 'erc721',
        symbol: 'NOUN',
        address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
        decimal: '0',
        sub_cap: 10,
        hard_cap: 1,
    },

    {
        strategy_type: 'token',
        type: 'erc20',
        symbol: 'SHARK',
        address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
        decimal: '18',
        sub_cap: 10,
        hard_cap: 100,
    },
    
    {
        strategy_type: 'token',
        type: 'erc20',
        symbol: 'SHARK',
        address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
        decimal: '18',
        sub_cap: 10,
        hard_cap: 8,
    },
    {
        strategy_type: 'token',
        type: 'erc20',
        symbol: 'SHARK',
        address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
        decimal: '18',
        sub_cap: 10,
        hard_cap: 50,
    },
    {
        strategy_type: 'arcade',
        sub_cap: 0,
        hard_cap: 50,
    },
    {
        strategy_type: 'arcade',
        sub_cap: 10,
        hard_cap: 50,
    },
    {
        strategy_type: 'arcade',
        sub_cap: 0,
        hard_cap: 0,
    },
    
]


let expected_metrics = [
    { status: 200, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
    { status: 200, response: `{"sub_total_vp":9,"sub_votes_spent":0,"sub_remaining_vp":9}` },
    { status: 200, response: `{"sub_total_vp":8,"sub_votes_spent":0,"sub_remaining_vp":8}` },
    { status: 200, response: `{"sub_total_vp":9,"sub_votes_spent":0,"sub_remaining_vp":9}` },
    { status: 200, response: `{"sub_total_vp":50,"sub_votes_spent":0,"sub_remaining_vp":50}` },
    { status: 200, response: `{"sub_total_vp":10,"sub_votes_spent":0,"sub_remaining_vp":10}` },
    { status: 200, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` }
]

let expected_metrics_after_vote = [
    // pass restriction condition
    [
        { status: 419, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 200, response: `{"sub_total_vp":9,"sub_votes_spent":1,"sub_remaining_vp":8}` },
        { status: 200, response: `{"sub_total_vp":8,"sub_votes_spent":1,"sub_remaining_vp":7}` },
        { status: 200, response: `{"sub_total_vp":9,"sub_votes_spent":1,"sub_remaining_vp":8}` },
        { status: 200, response: `{"sub_total_vp":50,"sub_votes_spent":1,"sub_remaining_vp":49}` },
        { status: 200, response: `{"sub_total_vp":10,"sub_votes_spent":1,"sub_remaining_vp":9}` },
        { status: 419, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` }
    ],
    // fail restriction condition
    [
        { status: 419, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 419, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 419, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 419, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 419, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 419, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 419, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` }
    ]
]

describe('protected routes voting tests', async () => {

    for (const [index, value] of voting_strategies.entries()) {

        it(`running suite for strategy-${index}`, async () => {

            let test_setup = 0;

            const mock_settings = JSON.parse(JSON.stringify(settings));
            mock_settings.voting_strategy = voting_strategies[index];
            mock_settings.voter_restrictions = voter_restrictions[test_setup]

            // make the dummy contest
            let dummy_contest_response = await createDummyContest(index, mock_settings)
            expect(dummy_contest_response.status).to.eql(200)

            // fetch the dummy contest
            let fetch_dummy_contest_response = await fetchDummyContest(index)
            expect(fetch_dummy_contest_response.status).to.eql(200)
            let contest_hash = fetch_dummy_contest_response.body[index]._hash

            // create a dummy submbission
            let dummy_submission_response = await createDummySubmission(index, contest_hash)
            expect(dummy_submission_response.status).to.eql(200)
            let submission_id = JSON.parse(dummy_submission_response.text).id

            
            // run the voting metrics
            let user_metrics_response = await fetchVotingMetrics(index, contest_hash, submission_id)
            expect(user_metrics_response.status).to.eql(200)
            user_metrics_response = JSON.stringify(JSON.parse(user_metrics_response.text).metrics)
            expect(user_metrics_response).to.eql(expected_metrics[index].response)
            

            // begin protected operations

            // get a jwt
            // cast a vote
            // check the metrics again



            // cast a dummy vote
            let num_votes = 1
            let dummy_vote_response = await castDummyVote(index, contest_hash, submission_id, num_votes)
            expect(dummy_vote_response.status).to.eql(expected_metrics_after_vote[test_setup][index].status)

            
            let user_metrics_after_vote = await fetchVotingMetrics(index, contest_hash, submission_id)

            expect(user_metrics_after_vote.status).to.eql(200)
            user_metrics_after_vote = JSON.stringify(JSON.parse(user_metrics_after_vote.text).metrics)
            expect(user_metrics_after_vote).to.eql(expected_metrics_after_vote[test_setup][index].response)
            
            // retract and set expected back to initial

            // check metrics after retracting


        })
    }

})


