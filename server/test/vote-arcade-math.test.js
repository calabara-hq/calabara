const { expect } = require('chai');
let { base_settings, test_token_strategies, test_arcade_strategies, test_voter_restrictions, test_submitter_restrictions } = require('./helpers/dummy-settings')
const { createDummyContest, fetchDummyContest, createDummySubmission, fetchVotingMetrics, castDummyVote, cleanup } = require('./master.test');
const { create_voting_scenario, create_dummy_submission } = require('./helpers/contest-test-setup')






const check_metrics = async (contest_hash, submission_id, exp) => {
    let metrics = await fetchVotingMetrics(contest_hash, submission_id)
    expect(metrics.status).to.eql(200)
    metrics = JSON.stringify(JSON.parse(metrics.text).metrics)
    expect(metrics).to.eql(exp)
}

const cast_vote = async (contest_hash, submission_id, num_votes, exp) => {
    let response = await castDummyVote(contest_hash, submission_id, num_votes)
    expect(response.status).to.eql(exp)
}


describe('arcade voting math', async (done) => {

    it('single sub no restrictions', async () => {
        let voting_strategy = {
            strategy_type: 'arcade',
            sub_cap: 0,
            hard_cap: 100,
        }

        let voter_restrictions = []
        let submitter_restrictions = []

        const contest_hash = await create_voting_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        const submission_id = await create_dummy_submission(contest_hash)

        await check_metrics(contest_hash, submission_id, '{"sub_total_vp":100,"sub_votes_spent":0,"sub_remaining_vp":100}')
        await cast_vote(contest_hash, submission_id, 1, 200)
        await check_metrics(contest_hash, submission_id, '{"sub_total_vp":100,"sub_votes_spent":1,"sub_remaining_vp":99}')

        await cast_vote(contest_hash, submission_id, 10, 200)
        await check_metrics(contest_hash, submission_id, '{"sub_total_vp":100,"sub_votes_spent":10,"sub_remaining_vp":90}')

        await cleanup();

    })


    it('single sub subcap off', async () => {
        let voting_strategy = {
            strategy_type: 'arcade',
            sub_cap: 0,
            hard_cap: 100,
        }

        let voter_restrictions = [
            {
                type: 'erc20',
                symbol: 'SHARK',
                address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
                decimal: 18,
                threshold: 1
            }
        ]

        let submitter_restrictions = []

        const contest_hash = await create_voting_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        const submission_id = await create_dummy_submission(contest_hash)

        await check_metrics(contest_hash, submission_id, '{"sub_total_vp":100,"sub_votes_spent":0,"sub_remaining_vp":100}')
        await cast_vote(contest_hash, submission_id, 1, 200)
        await check_metrics(contest_hash, submission_id, '{"sub_total_vp":100,"sub_votes_spent":1,"sub_remaining_vp":99}')

        await cast_vote(contest_hash, submission_id, 10, 200)
        await check_metrics(contest_hash, submission_id, '{"sub_total_vp":100,"sub_votes_spent":10,"sub_remaining_vp":90}')

        await cleanup();

    })


    it('single sub subcap on', async () => {
        let voting_strategy = {
            strategy_type: 'arcade',
            sub_cap: 50,
            hard_cap: 100,
        }

        let voter_restrictions = [
            {
                type: 'erc20',
                symbol: 'SHARK',
                address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
                decimal: 18,
                threshold: 1
            }
        ]

        let submitter_restrictions = []

        const contest_hash = await create_voting_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        const submission_id = await create_dummy_submission(contest_hash)

        await check_metrics(contest_hash, submission_id, '{"sub_total_vp":50,"sub_votes_spent":0,"sub_remaining_vp":50}')
        await cast_vote(contest_hash, submission_id, 1, 200)
        await check_metrics(contest_hash, submission_id, '{"sub_total_vp":50,"sub_votes_spent":1,"sub_remaining_vp":49}')

        await cast_vote(contest_hash, submission_id, 10, 200)
        await check_metrics(contest_hash, submission_id, '{"sub_total_vp":50,"sub_votes_spent":10,"sub_remaining_vp":40}')

        await cleanup();

    })

    it('multi sub subcap off', async () => {
        let voting_strategy = {
            strategy_type: 'arcade',
            sub_cap: 0,
            hard_cap: 100,
        }

        let voter_restrictions = [
            {
                type: 'erc20',
                symbol: 'SHARK',
                address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
                decimal: 18,
                threshold: 1
            }
        ]

        let submitter_restrictions = []

        const contest_hash = await create_voting_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        const submission_id_1 = await create_dummy_submission(contest_hash)
        const submission_id_2 = await create_dummy_submission(contest_hash)


        await check_metrics(contest_hash, submission_id_1, '{"sub_total_vp":100,"sub_votes_spent":0,"sub_remaining_vp":100}')
        await check_metrics(contest_hash, submission_id_2, '{"sub_total_vp":100,"sub_votes_spent":0,"sub_remaining_vp":100}')


        // spend 10 votes on sub_1
        await cast_vote(contest_hash, submission_id_1, 10, 200)
        await check_metrics(contest_hash, submission_id_1, '{"sub_total_vp":100,"sub_votes_spent":10,"sub_remaining_vp":90}')
        await check_metrics(contest_hash, submission_id_2, '{"sub_total_vp":90,"sub_votes_spent":0,"sub_remaining_vp":90}')


        // spend 20 votes on sub_1
        await cast_vote(contest_hash, submission_id_1, 20, 200)
        await check_metrics(contest_hash, submission_id_1, '{"sub_total_vp":100,"sub_votes_spent":20,"sub_remaining_vp":80}')
        await check_metrics(contest_hash, submission_id_2, '{"sub_total_vp":80,"sub_votes_spent":0,"sub_remaining_vp":80}')


        // spend 20 votes on sub_2
        await cast_vote(contest_hash, submission_id_2, 20, 200)
        await check_metrics(contest_hash, submission_id_1, '{"sub_total_vp":80,"sub_votes_spent":20,"sub_remaining_vp":60}')
        await check_metrics(contest_hash, submission_id_2, '{"sub_total_vp":80,"sub_votes_spent":20,"sub_remaining_vp":60}')

        await cleanup();

    })

    
    it('multi sub subcap on', async () => {
        let voting_strategy = {
            strategy_type: 'arcade',
            sub_cap: 20,
            hard_cap: 100,
        }

        let voter_restrictions = [
            {
                type: 'erc20',
                symbol: 'SHARK',
                address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
                decimal: 18,
                threshold: 1
            }
        ]

        let submitter_restrictions = [];

        const contest_hash = await create_voting_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        const submission_id_1 = await create_dummy_submission(contest_hash)
        const submission_id_2 = await create_dummy_submission(contest_hash)

        await check_metrics(contest_hash, submission_id_1, '{"sub_total_vp":20,"sub_votes_spent":0,"sub_remaining_vp":20}')
        await check_metrics(contest_hash, submission_id_2, '{"sub_total_vp":20,"sub_votes_spent":0,"sub_remaining_vp":20}')


        // spend 10 votes on sub_1
        await cast_vote(contest_hash, submission_id_1, 10, 200)
        await check_metrics(contest_hash, submission_id_1, '{"sub_total_vp":20,"sub_votes_spent":10,"sub_remaining_vp":10}')
        await check_metrics(contest_hash, submission_id_2, '{"sub_total_vp":20,"sub_votes_spent":0,"sub_remaining_vp":20}')


        // spend 20 votes on sub_1
        await cast_vote(contest_hash, submission_id_1, 20, 200)
        await check_metrics(contest_hash, submission_id_1, '{"sub_total_vp":20,"sub_votes_spent":20,"sub_remaining_vp":0}')
        await check_metrics(contest_hash, submission_id_2, '{"sub_total_vp":20,"sub_votes_spent":0,"sub_remaining_vp":20}')


        // spend 2000 votes on sub_2
        await cast_vote(contest_hash, submission_id_2, 20, 200)
        await check_metrics(contest_hash, submission_id_1, '{"sub_total_vp":20,"sub_votes_spent":20,"sub_remaining_vp":0}')
        await check_metrics(contest_hash, submission_id_2, '{"sub_total_vp":20,"sub_votes_spent":20,"sub_remaining_vp":0}')

        await cleanup();

    })
/*
    it('multi sub hardcap on subcap on', async () => {
        let voting_strategy = {
            strategy_type: 'arcade',
            sub_cap: 0,
            hard_cap: 0,
        }

        let voter_restrictions = [
            {
                type: 'erc20',
                symbol: 'SHARK',
                address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
                decimal: 18,
                threshold: 1
            }
        ]

        let submitter_restrictions = []

        const contest_hash = await create_voting_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        const submission_id_1 = await create_dummy_submission(contest_hash)
        const submission_id_2 = await create_dummy_submission(contest_hash)

        await check_metrics(contest_hash, submission_id_1, '{"sub_total_vp":20,"sub_votes_spent":0,"sub_remaining_vp":20}')
        await check_metrics(contest_hash, submission_id_2, '{"sub_total_vp":20,"sub_votes_spent":0,"sub_remaining_vp":20}')


        // spend 10 votes on sub_1
        await cast_vote(contest_hash, submission_id_1, 10, 200)
        await check_metrics(contest_hash, submission_id_1, '{"sub_total_vp":20,"sub_votes_spent":10,"sub_remaining_vp":10}')
        await check_metrics(contest_hash, submission_id_2, '{"sub_total_vp":20,"sub_votes_spent":0,"sub_remaining_vp":20}')


        // spend 20 votes on sub_1
        await cast_vote(contest_hash, submission_id_1, 20, 200)
        await check_metrics(contest_hash, submission_id_1, '{"sub_total_vp":20,"sub_votes_spent":20,"sub_remaining_vp":0}')
        await check_metrics(contest_hash, submission_id_2, '{"sub_total_vp":20,"sub_votes_spent":0,"sub_remaining_vp":20}')


        // spend 2000 votes on sub_2
        await cast_vote(contest_hash, submission_id_2, 20, 200)
        await check_metrics(contest_hash, submission_id_1, '{"sub_total_vp":20,"sub_votes_spent":20,"sub_remaining_vp":0}')
        await check_metrics(contest_hash, submission_id_2, '{"sub_total_vp":20,"sub_votes_spent":20,"sub_remaining_vp":0}')

        await cleanup();

    })
*/
    done();
})


