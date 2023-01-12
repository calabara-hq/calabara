const { expect } = require('chai');
const { createDummyContest, fetchDummyContest, createDummySubmission, createRealSubmission, fetchVotingMetrics, castDummyVote, cleanup } = require('../../master.test');
const { create_voting_scenario, create_accepting_submissions_scenario, create_contest_end_scenario, create_dummy_submission } = require('../helpers/contest-test-setup')

describe('misc. voting tests', async (done) => {

    it(`self voting off`, async () => {

        let voting_strategy = {}
        let voter_restrictions = []
        let submitter_restrictions = []
        let anon_subs = false
        let visible_votes = false
        let self_voting = false

        let contest_hash = await create_voting_scenario(voting_strategy, submitter_restrictions, voter_restrictions, anon_subs, visible_votes, self_voting)
        let submission_id = await create_dummy_submission(contest_hash, '0xe9ad38d6E38E0A9970D6ebEc84C73DEA3e025da1')
        let dummy_vote_response = await castDummyVote(contest_hash, submission_id, 1)
        expect(dummy_vote_response.status).to.eql(435)


        await cleanup();
    })

    it(`self voting on`, async () => {

        let voting_strategy = {}
        let voter_restrictions = []
        let submitter_restrictions = []
        let anon_subs = false
        let visible_votes = false
        let self_voting = true

        let contest_hash = await create_voting_scenario(voting_strategy, submitter_restrictions, voter_restrictions, anon_subs, visible_votes, self_voting)
        let submission_id = await create_dummy_submission(contest_hash, '0xe9ad38d6E38E0A9970D6ebEc84C73DEA3e025da1')
        let dummy_vote_response = await castDummyVote(contest_hash, submission_id, 1)
        expect(dummy_vote_response.status).to.eql(200)


        await cleanup();
    })

    done();

})


