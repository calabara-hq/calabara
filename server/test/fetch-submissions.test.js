const { expect } = require('chai');
const { create_accepting_submissions_scenario, create_contest_end_scenario } = require('./helpers/contest-test-setup');

const {fetchSubmissions, cleanup, createRealSubmission, } = require('./master.test');


describe('test fetch submissions', async (done) => {

    it('no anon_subs / no visible votes', async () => {


        let voting_strategy = {}
        let submitter_restrictions = {}
        let voter_restrictions = {}
        let anon_subs = false;
        let visible_votes = false;

        let contest_hash = await create_accepting_submissions_scenario(voting_strategy, submitter_restrictions, voter_restrictions, anon_subs, visible_votes)
        let submission_id = await createRealSubmission(contest_hash)

        let submissions_response = await fetchSubmissions(contest_hash)

        expect(submissions_response.body).to.be.an('array');
        submissions_response.body.forEach((result) => {
            expect(result).to.have.property('author');
            expect(result).to.not.have.property('votes');
        });
        await cleanup();

    })

    
    it('anon_subs / no visible votes', async () => {
        let voting_strategy = {}
        let submitter_restrictions = {}
        let voter_restrictions = {}
        let anon_subs = true;
        let visible_votes = false;

        let contest_hash = await create_accepting_submissions_scenario(voting_strategy, submitter_restrictions, voter_restrictions, anon_subs, visible_votes)
        let submission_id = await createRealSubmission(contest_hash)

        let submissions_response = await fetchSubmissions(contest_hash)

        expect(submissions_response.body).to.be.an('array');
        submissions_response.body.forEach((result) => {
            expect(result).to.not.have.property('votes');
            expect(result).to.not.have.property('author');
        });

        await cleanup();
    })

    it('no anon_subs / visible votes', async () => {
        let voting_strategy = {}
        let submitter_restrictions = {}
        let voter_restrictions = {}
        let anon_subs = false;
        let visible_votes = true;

        let contest_hash = await create_accepting_submissions_scenario(voting_strategy, submitter_restrictions, voter_restrictions, anon_subs, visible_votes)
        let submission_id = await createRealSubmission(contest_hash)

        let submissions_response = await fetchSubmissions(contest_hash)

        expect(submissions_response.body).to.be.an('array');
        submissions_response.body.forEach((result) => {
            expect(result).to.have.property('votes');
            expect(result).to.have.property('author');
        });

        await cleanup();
    })

    it('anon_subs / visible votes', async () => {
        let voting_strategy = {}
        let submitter_restrictions = {}
        let voter_restrictions = {}
        let anon_subs = true;
        let visible_votes = true;

        let contest_hash = await create_accepting_submissions_scenario(voting_strategy, submitter_restrictions, voter_restrictions, anon_subs, visible_votes)
        let submission_id = await createRealSubmission(contest_hash)

        let submissions_response = await fetchSubmissions(contest_hash)

        expect(submissions_response.body).to.be.an('array');
        submissions_response.body.forEach((result) => {
            expect(result).to.have.property('votes');
            expect(result).to.not.have.property('author');
        });

        await cleanup();
    })

    it('contest over / no anon subs / no visible votes', async () => {
        let voting_strategy = {}
        let submitter_restrictions = {}
        let voter_restrictions = {}
        let anon_subs = false;
        let visible_votes = false;

        let contest_hash = await create_contest_end_scenario(voting_strategy, submitter_restrictions, voter_restrictions, anon_subs, visible_votes)
        let submission_id = await createRealSubmission(contest_hash)

        let submissions_response = await fetchSubmissions(contest_hash)

        expect(submissions_response.body).to.be.an('array');
        submissions_response.body.forEach((result) => {
            expect(result).to.have.property('votes');
            expect(result).to.have.property('author');
        });

        await cleanup();
    })


    it('contest over / anon subs / no visible votes', async () => {
        let voting_strategy = {}
        let submitter_restrictions = {}
        let voter_restrictions = {}
        let anon_subs = true;
        let visible_votes = false;

        let contest_hash = await create_contest_end_scenario(voting_strategy, submitter_restrictions, voter_restrictions, anon_subs, visible_votes)
        let submission_id = await createRealSubmission(contest_hash)

        let submissions_response = await fetchSubmissions(contest_hash)

        expect(submissions_response.body).to.be.an('array');
        submissions_response.body.forEach((result) => {
            expect(result).to.have.property('votes');
            expect(result).to.have.property('author');
        });

        await cleanup();
    })

    it('contest over / no anon subs / visible votes', async () => {
        let voting_strategy = {}
        let submitter_restrictions = {}
        let voter_restrictions = {}
        let anon_subs = false;
        let visible_votes = true;

        let contest_hash = await create_contest_end_scenario(voting_strategy, submitter_restrictions, voter_restrictions, anon_subs, visible_votes)
        let submission_id = await createRealSubmission(contest_hash)

        let submissions_response = await fetchSubmissions(contest_hash)

        expect(submissions_response.body).to.be.an('array');
        submissions_response.body.forEach((result) => {
            expect(result).to.have.property('votes');
            expect(result).to.have.property('author');
        });

        await cleanup();
    })

    it('contest over / anon subs / visible votes', async () => {
        let voting_strategy = {}
        let submitter_restrictions = {}
        let voter_restrictions = {}
        let anon_subs = true;
        let visible_votes = true;

        let contest_hash = await create_contest_end_scenario(voting_strategy, submitter_restrictions, voter_restrictions, anon_subs, visible_votes)
        let submission_id = await createRealSubmission(contest_hash)

        let submissions_response = await fetchSubmissions(contest_hash)

        expect(submissions_response.body).to.be.an('array');
        submissions_response.body.forEach((result) => {
            expect(result).to.have.property('votes');
            expect(result).to.have.property('author');
        });

        await cleanup();
    })


    done();

})


