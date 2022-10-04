const { expect } = require('chai');
const { castDummyVote, cleanup } = require('./master.test');
const { create_voting_scenario, create_accepting_submissions_scenario, create_contest_end_scenario, create_dummy_submission } = require('./helpers/contest-test-setup')

describe('voting window tests', async (done) => {

    it(`vote during submit window`, async () => {

        let voting_strategy = {
            strategy_type: 'token',
            type: 'erc20',
            symbol: 'SHARK',
            address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
            decimal: 18,
            sub_cap: 0,
            hard_cap: 0,
        }

        let voter_restrictions = []
        let submitter_restrictions = []

        let contest_hash = await create_accepting_submissions_scenario(voting_strategy, submitter_restrictions, voter_restrictions)

        let submission_id = await create_dummy_submission(contest_hash)

        let dummy_vote_response = await castDummyVote(contest_hash, submission_id, 1)
        expect(dummy_vote_response.status).to.eql(433)

        await cleanup();
    })


    it(`vote during vote window`, async () => {

        let voting_strategy = {
            strategy_type: 'token',
            type: 'erc20',
            symbol: 'SHARK',
            address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
            decimal: 18,
            sub_cap: 0,
            hard_cap: 0,
        }

        let voter_restrictions = []
        let submitter_restrictions = []


        let contest_hash = await create_voting_scenario(voting_strategy, submitter_restrictions, voter_restrictions)

        let submission_id = await create_dummy_submission(contest_hash)

        let dummy_vote_response = await castDummyVote(contest_hash, submission_id, 1)
        expect(dummy_vote_response.status).to.eql(200)

        await cleanup();
    })

    it(`vote after contest end`, async () => {

        let voting_strategy = {
            strategy_type: 'token',
            type: 'erc20',
            symbol: 'SHARK',
            address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
            decimal: 18,
            sub_cap: 0,
            hard_cap: 0,
        }

        let voter_restrictions = []
        let submitter_restrictions = []


        let contest_hash = await create_contest_end_scenario(voting_strategy, submitter_restrictions, voter_restrictions)

        let submission_id = await create_dummy_submission(contest_hash)

        let dummy_vote_response = await castDummyVote(contest_hash, submission_id, 1)
        expect(dummy_vote_response.status).to.eql(433)

        await cleanup();
    })

    done();

})


