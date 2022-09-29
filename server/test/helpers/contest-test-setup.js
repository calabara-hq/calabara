const { createDummyContest, createDummySubmission, fetchDummyContest } = require("../master.test");
const { base_settings } = require('./dummy-settings')


const create_voting_scenario = async (voting_strategy, submitter_restrictions, voter_restrictions) => {
    const mock_settings = JSON.parse(JSON.stringify(base_settings));
    mock_settings.voting_strategy = JSON.parse(JSON.stringify(voting_strategy));
    mock_settings.submitter_restrictions = JSON.parse(JSON.stringify(submitter_restrictions));
    mock_settings.voter_restrictions = JSON.parse(JSON.stringify(voter_restrictions));
    let current_date = new Date()
    mock_settings.date_times.start_date = new Date(current_date.getTime() - 10 * 60000).toISOString();
    mock_settings.date_times.voting_begin = new Date(current_date.getTime() - 5 * 60000).toISOString();
    mock_settings.date_times.end_date = new Date(current_date.getTime() + 10 * 60000).toISOString();

    // make a dummy contest
    let dummy_contest_response = await createDummyContest(mock_settings)

    // fetch the dummy contest

    let fetch_dummy_contest_response = await fetchDummyContest()
    let contest_hash = fetch_dummy_contest_response.body[0]._hash

    // create a dummy submbission

    let dummy_submission_response = await createDummySubmission(contest_hash)
    let submission_id = JSON.parse(dummy_submission_response.text).id
    return [contest_hash, submission_id]

}

const create_accepting_submissions_scenario = async (voting_strategy, submitter_restrictions, voter_restrictions) => {
    const mock_settings = JSON.parse(JSON.stringify(base_settings));
    mock_settings.voting_strategy = JSON.parse(JSON.stringify(voting_strategy));
    mock_settings.submitter_restrictions = JSON.parse(JSON.stringify(submitter_restrictions));
    mock_settings.voter_restrictions = JSON.parse(JSON.stringify(voter_restrictions));
    let current_date = new Date()
    mock_settings.date_times.start_date = current_date.toISOString();
    mock_settings.date_times.voting_begin = new Date(current_date.getTime() + 5 * 60000).toISOString();
    mock_settings.date_times.end_date = new Date(current_date.getTime() + 10 * 60000).toISOString();


    // make a dummy contest
    let dummy_contest_response = await createDummyContest(mock_settings)
    // fetch the dummy contest

    let fetch_dummy_contest_response = await fetchDummyContest()
    let contest_hash = fetch_dummy_contest_response.body[0]._hash

    // create a dummy submbission

    let dummy_submission_response = await createDummySubmission(contest_hash)
    let submission_id = JSON.parse(dummy_submission_response.text).id
    return [contest_hash, submission_id]

}

const create_contest_end_scenario = async (voting_strategy, submitter_restrictions, voter_restrictions) => {
    const mock_settings = JSON.parse(JSON.stringify(base_settings));
    mock_settings.voting_strategy = JSON.parse(JSON.stringify(voting_strategy));
    mock_settings.submitter_restrictions = JSON.parse(JSON.stringify(submitter_restrictions));
    mock_settings.voter_restrictions = JSON.parse(JSON.stringify(voter_restrictions));
    let current_date = new Date()
    mock_settings.date_times.start_date = new Date(current_date.getTime() - 20 * 60000).toISOString();
    mock_settings.date_times.voting_begin = new Date(current_date.getTime() - 10 * 60000).toISOString();
    mock_settings.date_times.end_date = new Date(current_date.getTime() - 5 * 60000).toISOString();


    // make a dummy contest
    let dummy_contest_response = await createDummyContest(mock_settings)

    // fetch the dummy contest

    let fetch_dummy_contest_response = await fetchDummyContest()
    let contest_hash = fetch_dummy_contest_response.body[0]._hash

    // create a dummy submbission

    let dummy_submission_response = await createDummySubmission(contest_hash)
    let submission_id = JSON.parse(dummy_submission_response.text).id
    return [contest_hash, submission_id]

}


module.exports = { create_voting_scenario, create_accepting_submissions_scenario, create_contest_end_scenario }