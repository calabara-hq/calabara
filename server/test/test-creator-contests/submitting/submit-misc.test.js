const { expect } = require('chai');
const { createDummyContest, fetchDummyContest, createDummySubmission, createRealSubmission, fetchVotingMetrics, castDummyVote, cleanup } = require('../../master.test');
const { create_voting_scenario, create_accepting_submissions_scenario, create_contest_end_scenario } = require('../helpers/contest-test-setup')

describe('misc. submitting tests', async (done) => {

    it(`limit 1 submission`, async () => {

        let voting_strategy = {}
        let voter_restrictions = []
        let submitter_restrictions = []


        let contest_hash = await create_accepting_submissions_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        let real_submission_response1 = await createRealSubmission(contest_hash)
        expect(real_submission_response1.status).to.eql(200)

        // wanna see me do it again?
        let real_submission_response2 = await createRealSubmission(contest_hash)
        expect(real_submission_response2.status).to.eql(420)

        await cleanup();
    })

    done();

})


