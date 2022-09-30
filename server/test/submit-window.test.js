const { expect } = require('chai');
const { createRealSubmission, cleanup } = require('./master.test');
const { create_voting_scenario, create_accepting_submissions_scenario, create_contest_end_scenario } = require('./helpers/contest-test-setup')

describe('submitting window tests', async (done) => {

    it(`submit during submit window`, async () => {

        let voting_strategy = {}
        let voter_restrictions = {}
        let submitter_restrictions = {}


        let contest_hash = await create_accepting_submissions_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        let real_submission_response = await createRealSubmission(contest_hash)
        expect(real_submission_response.status).to.eql(200)

        await cleanup();
    })

    it(`submit during voting window`, async () => {

        let voting_strategy = {}
        let voter_restrictions = {}
        let submitter_restrictions = {}


        let contest_hash = await create_voting_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        let real_submission_response = await createRealSubmission(contest_hash)
        expect(real_submission_response.status).to.eql(432)

        await cleanup();
    })


    it(`submit after contest end`, async () => {

        let voting_strategy = {}
        let voter_restrictions = {}
        let submitter_restrictions = {}


        let contest_hash = await create_contest_end_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        let real_submission_response = await createRealSubmission(contest_hash)
        expect(real_submission_response.status).to.eql(432)

        await cleanup();
    })



    done();

})


