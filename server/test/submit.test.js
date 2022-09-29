const { expect } = require('chai');
let settings = require('./helpers/dummy-settings')

const { createDummyContest, fetchDummyContest, createDummySubmission, fetchVotingMetrics, castDummyVote } = require('./master.test');



describe('test submit with no submitter / voter restrictions', async () => {
    /*
    const mock_settings = JSON.parse(JSON.stringify(settings));
    let current_date = new Date()
    mock_settings.date_times.start_date = current_date.toISOString();
    // voting begins in 10 mins
    mock_settings.voting_begin = new Date(current_date.getTime() + 10 * 60000).toISOString();
    // ends in 20 mins
    mock_settings.voting_begin = new Date(current_date.getTime() + 20 * 60000).toISOString();

    // empty submitter / voter restrictions
    mock_settings.submitter_restrictions = {};
    mock_settings.voter_restrictions = {};


    it('submit with no voter / submitter restrictions', async () => {
        // make the dummy contest
        let dummy_contest_response = await createDummyContest(mock_settings)
        expect(dummy_contest_response.status).to.eql(200)

        // fetch the contest
        let fetch_dummy_contest_response = await fetchDummyContest()
        expect(fetch_dummy_contest_response.status).to.eql(200)
        let contest_hash = fetch_dummy_contest_response.body._hash

        // try to create a submission
        let dummy_submission_response = await createDummySubmission(contest_hash)
        expect(dummy_submission_response.status).to.eql(200)
        let submission_id = JSON.parse(dummy_submission_response.text).id
    })

    */

    /*
        voting_strategies.forEach((strategy, index) => {
    
            const mock_settings = JSON.parse(JSON.stringify(settings));
            mock_settings.voting_strategy = voting_strategies[index];
            const initial_expected_metrics = JSON.parse(JSON.stringify(expected_metrics))
    
            it(`running suite for strategy-${index}`, async () => {
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
               // console.log(user_metrics_response)
                expect(user_metrics_response).to.eql(expected_metrics[index])
    
            })
            
        })
        */

})

