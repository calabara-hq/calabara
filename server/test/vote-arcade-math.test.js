const { expect } = require('chai');
let { base_settings, test_token_strategies, test_arcade_strategies, test_voter_restrictions, test_submitter_restrictions } = require('./helpers/dummy-settings')
const { createDummyContest, fetchDummyContest, createDummySubmission, fetchVotingMetrics, castDummyVote, cleanup } = require('./master.test');


let expected_metrics = [
    [
        { status: 200, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 200, response: `{"sub_total_vp":9,"sub_votes_spent":0,"sub_remaining_vp":9}` },
        { status: 200, response: `{"sub_total_vp":8,"sub_votes_spent":0,"sub_remaining_vp":8}` },
        { status: 200, response: `{"sub_total_vp":9,"sub_votes_spent":0,"sub_remaining_vp":9}` },
        { status: 200, response: `{"sub_total_vp":50,"sub_votes_spent":0,"sub_remaining_vp":50}` },
        { status: 200, response: `{"sub_total_vp":10,"sub_votes_spent":0,"sub_remaining_vp":10}` },
        { status: 200, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` }
    ],
    [
        { status: 200, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 200, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 200, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 200, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 200, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 200, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 200, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` }
    ]
]

let expected_metrics_after_vote = [
    // pass restriction condition
    [
        { status: 419, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 200, response: `{"sub_total_vp":9,"sub_votes_spent":1,"sub_remaining_vp":8}` },
        { status: 200, response: `{"sub_total_vp":8,"sub_votes_spent":1,"sub_remaining_vp":7}` },
        { status: 200, response: `{"sub_total_vp":9,"sub_votes_spent":1,"sub_remaining_vp":8}` },
        { status: 200, response: `{"sub_total_vp":50,"sub_votes_spent":1,"sub_remaining_vp":49}` },
        { status: 200, response: `{"sub_total_vp":10,"sub_votes_spent":1,"sub_remaining_vp":9}` },
        { status: 419, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` }
    ],
    // fail restriction condition
    [
        { status: 419, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 419, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 419, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 419, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 419, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 419, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` },
        { status: 419, response: `{"sub_total_vp":0,"sub_votes_spent":0,"sub_remaining_vp":0}` }
    ]
]

const create_contest = async () => {

}

describe('voting tests', async (done) => {
    /*

for (const [index, value] of voting_strategies.entries()) {

it(`running suite for strategy-${index}`, async () => {

    let test_setup = 0;
    const mock_settings = JSON.parse(JSON.stringify(settings));
    mock_settings.voting_strategy = voting_strategies[index];
    mock_settings.voter_restrictions = voter_restrictions[test_setup]
    // make a dummy contest
    let dummy_contest_response = await createDummyContest(mock_settings)
    expect(dummy_contest_response.status).to.eql(200)

    // fetch the dummy contest
    let fetch_dummy_contest_response = await fetchDummyContest()
    expect(fetch_dummy_contest_response.status).to.eql(200)
    let contest_hash = fetch_dummy_contest_response.body[index]._hash


    // create a dummy submbission
    let dummy_submission_response = await createDummySubmission(contest_hash)
    expect(dummy_submission_response.status).to.eql(200)
    let submission_id = JSON.parse(dummy_submission_response.text).id


    // run the voting metrics
    let user_metrics_response = await fetchVotingMetrics(contest_hash, submission_id)
    expect(user_metrics_response.status).to.eql(200)
    user_metrics_response = JSON.stringify(JSON.parse(user_metrics_response.text).metrics)
    expect(user_metrics_response).to.eql(expected_metrics[test_setup][index].response)

    // cast a vote
    // check the metrics again


    let num_votes = 1
    let dummy_vote_response = await castDummyVote(contest_hash, submission_id, num_votes)
    expect(dummy_vote_response.status).to.eql(expected_metrics_after_vote[test_setup][index].status)
    console.log(dummy_vote_response)

    */

    /*
    let user_metrics_after_vote = await fetchVotingMetrics(contest_hash, submission_id)

    expect(user_metrics_after_vote.status).to.eql(200)
    user_metrics_after_vote = JSON.stringify(JSON.parse(user_metrics_after_vote.text).metrics)
    expect(user_metrics_after_vote).to.eql(expected_metrics_after_vote[test_setup][index].response)
    // retract and set expected back to initial

    // check metrics after retracting

    await cleanup();

})
}
                    */

    done();

})


