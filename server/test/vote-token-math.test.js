const { expect } = require('chai');
let { base_settings, test_token_strategies, test_arcade_strategies, test_voter_restrictions, test_submitter_restrictions } = require('./helpers/dummy-settings')
const { createDummyContest, fetchDummyContest, createDummySubmission, fetchVotingMetrics, castDummyVote, cleanup } = require('./master.test');
const { create_voting_scenario } = require('./helpers/contest-test-setup')

const get_voting_power = async (contest_hash, submission_id) => {
    // run the voting metrics
    let user_metrics_response = await fetchVotingMetrics(contest_hash, submission_id)
    expect(user_metrics_response.status).to.eql(200)
    user_metrics_response = JSON.stringify(JSON.parse(user_metrics_response.text).metrics)

    return user_metrics_response
}

const cast_votes = async (contest_hash, submission_id, num_votes) => {
    let dummy_vote_response = await castDummyVote(contest_hash, submission_id, num_votes)

}

describe('token voting tests', async (done) => {


    /*
    it(`unqualified voter erc721 strategy`, async () => {

        let strategy_index = 0;
        let restriction_index = 0;

        let [contest_hash, submission_id] = await create_voting_scenario(strategy_index, restriction_index)

        let original_metrics_response = await get_voting_power(contest_hash, submission_id)
        expect(original_metrics_response).to.eql('{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}')


        let dummy_vote_response = await castDummyVote(contest_hash, submission_id, 1)
        expect(dummy_vote_response.status).to.eql(436)

        let after_metrics_response = await get_voting_power(contest_hash, submission_id)
        expect(after_metrics_response).to.eql(original_metrics_response)

        await cleanup();
    })

    it(`unqualified voter erc20 strategy`, async () => {

        let strategy_index = 1;
        let restriction_index = 0;

        let [contest_hash, submission_id] = await create_voting_scenario(strategy_index, restriction_index)

        let original_metrics_response = await get_voting_power(contest_hash, submission_id)
        expect(original_metrics_response).to.eql('{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}')


        let dummy_vote_response = await castDummyVote(contest_hash, submission_id, 1)
        expect(dummy_vote_response.status).to.eql(436)

        let after_metrics_response = await get_voting_power(contest_hash, submission_id)
        expect(after_metrics_response).to.eql(original_metrics_response)

        await cleanup();
    })

    done();
    */

})


