const { expect } = require('chai');
const { createDummyContest, fetchDummyContest, createDummySubmission, createRealSubmission, fetchVotingMetrics, castDummyVote, cleanup } = require('../../master.test');
const { create_voting_scenario, create_accepting_submissions_scenario, create_contest_end_scenario } = require('../helpers/contest-test-setup')

describe('submitting restrictions tests', async (done) => {

    it(`no restrictions`, async () => {

        let voting_strategy = {}
        let voter_restrictions = []
        let submitter_restrictions = []


        let contest_hash = await create_accepting_submissions_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        let real_submission_response = await createRealSubmission(contest_hash)
        expect(real_submission_response.status).to.eql(200)

        await cleanup();
    })

    it(`1 restriction pass erc20`, async () => {

        let voting_strategy = {}
        let voter_restrictions = []
        let submitter_restrictions = [
            {
                type: 'erc20',
                symbol: 'SHARK',
                address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
                decimal: 0,
                threshold: 1
            }
        ]


        let contest_hash = await create_accepting_submissions_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        let real_submission_response = await createRealSubmission(contest_hash)
        expect(real_submission_response.status).to.eql(200)

        await cleanup();
    })

    it(`1 restriction fail erc20`, async () => {

        let voting_strategy = {}
        let voter_restrictions = {}
        let submitter_restrictions = [
            {
                type: 'erc20',
                symbol: 'SAFE',
                address: '0x5aFE3855358E112B5647B952709E6165e1c1eEEe',
                decimal: 18,
                threshold: 1
            }
        ]


        let contest_hash = await create_accepting_submissions_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        let real_submission_response = await createRealSubmission(contest_hash)
        expect(real_submission_response.status).to.eql(419)

        await cleanup();
    })

    it(`1 restriction pass erc721`, async () => {

        let voting_strategy = {}
        let voter_restrictions = []
        let submitter_restrictions = [
            {
                type: 'erc721',
                symbol: 'OxMosquitoes',
                address: '0xDb6fd84921272E288998a4B321B6C187BBd2BA4C',
                decimal: 0,
                threshold: 1
            }
        ]


        let contest_hash = await create_accepting_submissions_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        let real_submission_response = await createRealSubmission(contest_hash)
        expect(real_submission_response.status).to.eql(200)

        await cleanup();
    })

    it(`1 restriction fail erc721`, async () => {

        let voting_strategy = {}
        let voter_restrictions = {}
        let submitter_restrictions = [
            {
                type: 'erc721',
                symbol: 'NOUN',
                address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
                decimal: 0,
                threshold: 2
            }
        ]


        let contest_hash = await create_accepting_submissions_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        let real_submission_response = await createRealSubmission(contest_hash)
        expect(real_submission_response.status).to.eql(419)

        await cleanup();
    })


    it(`multi restriction pass`, async () => {

        let voting_strategy = {}
        let voter_restrictions = []
        let submitter_restrictions = [
            {
                type: 'erc20',
                symbol: 'SHARK',
                address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
                decimal: 18,
                threshold: 1
            },
            {
                type: 'erc721',
                symbol: 'NOUN',
                address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
                decimal: 0,
                threshold: 2
            },
            {
                type: 'erc721',
                symbol: 'MFER',
                address: '0x79FCDEF22feeD20eDDacbB2587640e45491b757f',
                decimal: 0,
                threshold: 3
            }
        ]


        let contest_hash = await create_accepting_submissions_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        let real_submission_response = await createRealSubmission(contest_hash)
        expect(real_submission_response.status).to.eql(200)

        await cleanup();
    })

    it(`multi restriction fail`, async () => {

        let voting_strategy = {}
        let voter_restrictions = []
        let submitter_restrictions = [

            {
                type: 'erc721',
                symbol: 'NOUN',
                address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
                decimal: 0,
                threshold: 2
            },
            {
                type: 'erc721',
                symbol: 'MFER',
                address: '0x79FCDEF22feeD20eDDacbB2587640e45491b757f',
                decimal: 0,
                threshold: 3
            }
        ]

        let contest_hash = await create_accepting_submissions_scenario(voting_strategy, submitter_restrictions, voter_restrictions)
        let real_submission_response = await createRealSubmission(contest_hash)
        expect(real_submission_response.status).to.eql(419)

        await cleanup();
    })

    done();

})


