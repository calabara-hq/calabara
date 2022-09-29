const { expect } = require('chai');
let { base_settings, test_token_strategies, test_arcade_strategies, test_voter_restrictions, test_submitter_restrictions } = require('./helpers/dummy-settings')
const { createDummyContest, fetchDummyContest, createDummySubmission, fetchVotingMetrics, castDummyVote, cleanup } = require('./master.test');
const { create_voting_scenario, create_accepting_submissions_scenario, create_contest_end_scenario } = require('./helpers/contest-test-setup')



describe('voting restrictions tests', async (done) => {

    it(`no voting restrictions`, async () => {

        let voting_strategy = {
            strategy_type: 'token',
            type: 'erc20',
            symbol: 'SHARK',
            address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
            decimal: 18,
            sub_cap: 0,
            hard_cap: 0,
        }

        let voter_restrictions = {}
        let submitter_restrictions = {}

        let [contest_hash, submission_id] = await create_voting_scenario(voting_strategy, submitter_restrictions, voter_restrictions)

        let dummy_vote_response = await castDummyVote(contest_hash, submission_id, 1)
        expect(dummy_vote_response.status).to.eql(200)

        await cleanup();
    })

    it(`1 voting restriction pass`, async () => {

        let voting_strategy = {
            strategy_type: 'token',
            type: 'erc20',
            symbol: 'SHARK',
            address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
            decimal: 18,
            sub_cap: 0,
            hard_cap: 0,
        }

        let voter_restrictions = {
            0: {
                type: 'erc20',
                symbol: 'SHARK',
                address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
                decimal: 18,
                threshold: 1
            }
        }
        let submitter_restrictions = {}
        
        let [contest_hash, submission_id] = await create_voting_scenario(voting_strategy, submitter_restrictions, voter_restrictions)


        let dummy_vote_response = await castDummyVote(contest_hash, submission_id, 1)
        expect(dummy_vote_response.status).to.eql(200)

        await cleanup();
    })

    it(`1 voting restriction fail`, async () => {

        let voting_strategy = {
            strategy_type: 'token',
            type: 'erc20',
            symbol: 'SHARK',
            address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
            decimal: 18,
            sub_cap: 0,
            hard_cap: 0,
        }

        let voter_restrictions = {
            0: {
                type: 'erc721',
                symbol: 'NOUN',
                address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
                decimal: 0,
                threshold: 2
            }
        }
        let submitter_restrictions = {}

        let [contest_hash, submission_id] = await create_voting_scenario(voting_strategy, submitter_restrictions, voter_restrictions)

        let dummy_vote_response = await castDummyVote(contest_hash, submission_id, 1)
        expect(dummy_vote_response.status).to.eql(434)

        await cleanup();
    })

    it(`multi restriction pass`, async () => {

        let voting_strategy = {
            strategy_type: 'token',
            type: 'erc20',
            symbol: 'SHARK',
            address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
            decimal: 18,
            sub_cap: 0,
            hard_cap: 0,
        }

        let voter_restrictions = {
            0: {
                type: 'erc20',
                symbol: 'SHARK',
                address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
                decimal: 18,
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
        }
        let submitter_restrictions = {}

        let [contest_hash, submission_id] = await create_voting_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        let dummy_vote_response = await castDummyVote(contest_hash, submission_id, 1)
        expect(dummy_vote_response.status).to.eql(200)

        await cleanup();
    })


    it(`multi restriction fail`, async () => {

        let voting_strategy = {
            strategy_type: 'token',
            type: 'erc20',
            symbol: 'SHARK',
            address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
            decimal: 18,
            sub_cap: 0,
            hard_cap: 0,
        }

        let voter_restrictions = {
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
        let submitter_restrictions = {}

        let [contest_hash, submission_id] = await create_voting_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        let dummy_vote_response = await castDummyVote(contest_hash, submission_id, 1)
        expect(dummy_vote_response.status).to.eql(434)

        await cleanup();
    })


    done();

})


