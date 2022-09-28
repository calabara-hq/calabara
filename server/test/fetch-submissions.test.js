const { expect } = require('chai');
let settings = require('./dummy-settings.test')

const { createDummyContest, fetchDummyContest, createDummySubmission, fetchVotingMetrics, castDummyVote, fetchSubmissions, cleanup, } = require('./master.test');


// test 5 different cases here
// 1: no anon_subs / no visible votes
// 2: anon subs + no visible_votes
// 3: no anon subs + visible votes
// 4: anon subs + visible votes
// 5: contest_end + all above cases
// for each case we'll also check the result when there are no submissions yet.



describe('test fetch submissions', async (done) => {
    // scope our variables

    it('no anon_subs / no visible votes', async () => {
        const mock_settings = JSON.parse(JSON.stringify(settings));
        
        let current_date = new Date()
        mock_settings.date_times.start_date = current_date.toISOString();
        mock_settings.date_times.voting_begin = new Date(current_date.getTime() + 10 * 60000).toISOString();
        mock_settings.date_times.end_date = new Date(current_date.getTime() + 20 * 60000).toISOString();
        mock_settings.anon_subs = false;
        mock_settings.visible_votes = false;

        // make the dummy contest
        let dummy_contest_response = await createDummyContest(mock_settings)
        expect(dummy_contest_response.status).to.eql(200)

        // fetch the contest
        let fetch_dummy_contest_response = await fetchDummyContest()
        expect(fetch_dummy_contest_response.status).to.eql(200)
        let contest_hash = fetch_dummy_contest_response.body[0]._hash

        // verify the empty array is returned when there aren't any subs yet
        let submissions_response_before = await fetchSubmissions(contest_hash)
        expect(submissions_response_before.body).to.be.an('array');
        expect(submissions_response_before.body).to.eql([])

        // create a submission
        let dummy_submission_response = await createDummySubmission(contest_hash)
        expect(dummy_submission_response.status).to.eql(200)

        // fetch the submissions 
        let submissions_response = await fetchSubmissions(contest_hash)
        // pluck a submission out and check if we got author field and not votes field

        expect(submissions_response.body).to.be.an('array');
        submissions_response.body.forEach((result) => {
            expect(result).to.have.property('author');
            expect(result).to.not.have.property('votes');
        });
        await cleanup();

    })

    
    it('anon_subs / no visible votes', async () => {
        const mock_settings = JSON.parse(JSON.stringify(settings));
        let current_date = new Date()
        mock_settings.date_times.start_date = current_date.toISOString();
        mock_settings.date_times.voting_begin = new Date(current_date.getTime() + 10 * 60000).toISOString();
        mock_settings.date_times.end_date = new Date(current_date.getTime() + 20 * 60000).toISOString();
        mock_settings.anon_subs = true;
        mock_settings.visible_votes = false;

        // make the dummy contest
        let dummy_contest_response = await createDummyContest(mock_settings)
        expect(dummy_contest_response.status).to.eql(200)

        // fetch the contest
        let fetch_dummy_contest_response = await fetchDummyContest()
        expect(fetch_dummy_contest_response.status).to.eql(200)
        let contest_hash = fetch_dummy_contest_response.body[0]._hash

        // verify the empty array is returned when there aren't any subs yet
        let submissions_response_before = await fetchSubmissions(contest_hash)
        expect(submissions_response_before.body).to.be.an('array');
        expect(submissions_response_before.body).to.eql([])

        // create a submission
        let dummy_submission_response = await createDummySubmission(contest_hash)
        expect(dummy_submission_response.status).to.eql(200)

        // fetch the submissions 
        let submissions_response = await fetchSubmissions(contest_hash)
        // pluck a submission out and check if we got author field and not votes field

        expect(submissions_response.body).to.be.an('array');
        submissions_response.body.forEach((result) => {
            expect(result).to.not.have.property('votes');
            expect(result).to.not.have.property('author');
        });

        await cleanup();
    })

    it('no anon_subs / visible votes', async () => {
        const mock_settings = JSON.parse(JSON.stringify(settings));
        let current_date = new Date()
        mock_settings.date_times.start_date = current_date.toISOString();
        mock_settings.date_times.voting_begin = new Date(current_date.getTime() + 10 * 60000).toISOString();
        mock_settings.date_times.end_date = new Date(current_date.getTime() + 20 * 60000).toISOString();
        mock_settings.anon_subs = false;
        mock_settings.visible_votes = true;

        // make the dummy contest
        let dummy_contest_response = await createDummyContest(mock_settings)
        expect(dummy_contest_response.status).to.eql(200)

        // fetch the contest
        let fetch_dummy_contest_response = await fetchDummyContest()
        expect(fetch_dummy_contest_response.status).to.eql(200)
        let contest_hash = fetch_dummy_contest_response.body[0]._hash

        // verify the empty array is returned when there aren't any subs yet
        let submissions_response_before = await fetchSubmissions(contest_hash)
        expect(submissions_response_before.body).to.be.an('array');
        expect(submissions_response_before.body).to.eql([])

        // create a submission
        let dummy_submission_response = await createDummySubmission(contest_hash)
        expect(dummy_submission_response.status).to.eql(200)

        // fetch the submissions 
        let submissions_response = await fetchSubmissions(contest_hash)
        // pluck a submission out and check if we got author field and not votes field

        expect(submissions_response.body).to.be.an('array');
        submissions_response.body.forEach((result) => {
            expect(result).to.have.property('votes');
            expect(result).to.have.property('author');
        });

        await cleanup();
    })

    it('anon_subs / visible votes', async () => {
        const mock_settings = JSON.parse(JSON.stringify(settings));
        let current_date = new Date()
        mock_settings.date_times.start_date = current_date.toISOString();
        mock_settings.date_times.voting_begin = new Date(current_date.getTime() + 10 * 60000).toISOString();
        mock_settings.date_times.end_date = new Date(current_date.getTime() + 20 * 60000).toISOString();
        mock_settings.anon_subs = true;
        mock_settings.visible_votes = true;

        // make the dummy contest
        let dummy_contest_response = await createDummyContest(mock_settings)
        expect(dummy_contest_response.status).to.eql(200)

        // fetch the contest
        let fetch_dummy_contest_response = await fetchDummyContest()
        expect(fetch_dummy_contest_response.status).to.eql(200)
        let contest_hash = fetch_dummy_contest_response.body[0]._hash

        // verify the empty array is returned when there aren't any subs yet
        let submissions_response_before = await fetchSubmissions(contest_hash)
        expect(submissions_response_before.body).to.be.an('array');
        expect(submissions_response_before.body).to.eql([])

        // create a submission
        let dummy_submission_response = await createDummySubmission(contest_hash)
        expect(dummy_submission_response.status).to.eql(200)

        // fetch the submissions 
        let submissions_response = await fetchSubmissions(contest_hash)
        // pluck a submission out and check if we got author field and not votes field

        expect(submissions_response.body).to.be.an('array');
        submissions_response.body.forEach((result) => {
            expect(result).to.have.property('votes');
            expect(result).to.not.have.property('author');
        });

        await cleanup();
    })

    it('contest over / no anon subs / no visible votes', async () => {
        const mock_settings = JSON.parse(JSON.stringify(settings));
        let current_date = new Date()
        mock_settings.date_times.start_date = current_date.toISOString();
        mock_settings.date_times.voting_begin = new Date(current_date.getTime() - 20 * 60000).toISOString();
        mock_settings.date_times.end_date = new Date(current_date.getTime() - 10 * 60000).toISOString();
        mock_settings.anon_subs = false;
        mock_settings.visible_votes = false;

        // make the dummy contest
        let dummy_contest_response = await createDummyContest(mock_settings)
        expect(dummy_contest_response.status).to.eql(200)

        // fetch the contest
        let fetch_dummy_contest_response = await fetchDummyContest()
        expect(fetch_dummy_contest_response.status).to.eql(200)
        let contest_hash = fetch_dummy_contest_response.body[0]._hash

        // verify the empty array is returned when there aren't any subs yet
        let submissions_response_before = await fetchSubmissions(contest_hash)
        expect(submissions_response_before.body).to.be.an('array');
        expect(submissions_response_before.body).to.eql([])

        // create a submission
        let dummy_submission_response = await createDummySubmission(contest_hash)
        expect(dummy_submission_response.status).to.eql(200)

        // fetch the submissions 
        let submissions_response = await fetchSubmissions(contest_hash)
        // pluck a submission out and check if we got author field and not votes field

        expect(submissions_response.body).to.be.an('array');
        submissions_response.body.forEach((result) => {
            expect(result).to.have.property('votes');
            expect(result).to.have.property('author');
        });

        await cleanup();
    })

    it('contest over / anon subs / no visible votes', async () => {
        const mock_settings = JSON.parse(JSON.stringify(settings));
        let current_date = new Date()
        mock_settings.date_times.start_date = current_date.toISOString();
        mock_settings.date_times.voting_begin = new Date(current_date.getTime() - 20 * 60000).toISOString();
        mock_settings.date_times.end_date = new Date(current_date.getTime() - 10 * 60000).toISOString();
        mock_settings.anon_subs = true;
        mock_settings.visible_votes = false;

        // make the dummy contest
        let dummy_contest_response = await createDummyContest(mock_settings)
        expect(dummy_contest_response.status).to.eql(200)

        // fetch the contest
        let fetch_dummy_contest_response = await fetchDummyContest()
        expect(fetch_dummy_contest_response.status).to.eql(200)
        let contest_hash = fetch_dummy_contest_response.body[0]._hash

        // verify the empty array is returned when there aren't any subs yet
        let submissions_response_before = await fetchSubmissions(contest_hash)
        expect(submissions_response_before.body).to.be.an('array');
        expect(submissions_response_before.body).to.eql([])

        // create a submission
        let dummy_submission_response = await createDummySubmission(contest_hash)
        expect(dummy_submission_response.status).to.eql(200)

        // fetch the submissions 
        let submissions_response = await fetchSubmissions(contest_hash)
        // pluck a submission out and check if we got author field and not votes field

        expect(submissions_response.body).to.be.an('array');
        submissions_response.body.forEach((result) => {
            expect(result).to.have.property('votes');
            expect(result).to.have.property('author');
        });

        await cleanup();
    })

    it('contest over / no anon subs / visible votes', async () => {
        const mock_settings = JSON.parse(JSON.stringify(settings));
        let current_date = new Date()
        mock_settings.date_times.start_date = current_date.toISOString();
        mock_settings.date_times.voting_begin = new Date(current_date.getTime() - 20 * 60000).toISOString();
        mock_settings.date_times.end_date = new Date(current_date.getTime() - 10 * 60000).toISOString();
        mock_settings.anon_subs = false;
        mock_settings.visible_votes = true;

        // make the dummy contest
        let dummy_contest_response = await createDummyContest(mock_settings)
        expect(dummy_contest_response.status).to.eql(200)

        // fetch the contest
        let fetch_dummy_contest_response = await fetchDummyContest()
        expect(fetch_dummy_contest_response.status).to.eql(200)
        let contest_hash = fetch_dummy_contest_response.body[0]._hash

        // verify the empty array is returned when there aren't any subs yet
        let submissions_response_before = await fetchSubmissions(contest_hash)
        expect(submissions_response_before.body).to.be.an('array');
        expect(submissions_response_before.body).to.eql([])

        // create a submission
        let dummy_submission_response = await createDummySubmission(contest_hash)
        expect(dummy_submission_response.status).to.eql(200)

        // fetch the submissions 
        let submissions_response = await fetchSubmissions(contest_hash)
        // pluck a submission out and check if we got author field and not votes field

        expect(submissions_response.body).to.be.an('array');
        submissions_response.body.forEach((result) => {
            expect(result).to.have.property('votes');
            expect(result).to.have.property('author');
        });

        await cleanup();
    })

    it('contest over / anon subs / visible votes', async () => {
        const mock_settings = JSON.parse(JSON.stringify(settings));
        let current_date = new Date()
        mock_settings.date_times.start_date = current_date.toISOString();
        mock_settings.date_times.voting_begin = new Date(current_date.getTime() - 20 * 60000).toISOString();
        mock_settings.date_times.end_date = new Date(current_date.getTime() - 10 * 60000).toISOString();
        mock_settings.anon_subs = false;
        mock_settings.visible_votes = true;

        // make the dummy contest
        let dummy_contest_response = await createDummyContest(mock_settings)
        expect(dummy_contest_response.status).to.eql(200)

        // fetch the contest
        let fetch_dummy_contest_response = await fetchDummyContest()
        expect(fetch_dummy_contest_response.status).to.eql(200)
        let contest_hash = fetch_dummy_contest_response.body[0]._hash

        // verify the empty array is returned when there aren't any subs yet
        let submissions_response_before = await fetchSubmissions(contest_hash)
        expect(submissions_response_before.body).to.be.an('array');
        expect(submissions_response_before.body).to.eql([])

        // create a submission
        let dummy_submission_response = await createDummySubmission(contest_hash)
        expect(dummy_submission_response.status).to.eql(200)

        // fetch the submissions 
        let submissions_response = await fetchSubmissions(contest_hash)
        // pluck a submission out and check if we got author field and not votes field

        expect(submissions_response.body).to.be.an('array');
        submissions_response.body.forEach((result) => {
            expect(result).to.have.property('votes');
            expect(result).to.have.property('author');
        });

        await cleanup();
    })


    done();
    
    
})


