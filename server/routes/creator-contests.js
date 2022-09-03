const express = require('express');
const db = require('../helpers/db-init.js')
const dotenv = require('dotenv')
const path = require('path')
const contests = express();
contests.use(express.json())
const asyncfs = require('fs').promises;
const fs = require('fs');
const FormData = require('form-data');
const { authenticateToken } = require('../middlewares/jwt-middleware.js');
const { isAdmin } = require('../middlewares/admin-middleware')
const { clean, asArray } = require('../helpers/common')
const { createContest } = require('../middlewares/creator-contests/create-contest-middleware');
const { createSubmission, checkSubmissionRestrictions, checkUserSubmissions, checkSubmitterEligibility } = require('../middlewares/creator-contests/submit-middleware.js');
const { calculateSubmissionVotingPower, getContestVotingStrategy, checkVoterEligibility, checkVoterRestrictions, verifyVotingPower } = require('../middlewares/creator-contests/vote-middleware.js');
const { imageUpload } = require('../middlewares/image-upload-middleware.js');
const { json } = require('body-parser');
const logger = require('../logger').child({ component: 'creator-contests' })

const serverRoot = path.normalize(path.join(__dirname, '../'));


contests.get('/fetch_org_contests/*', async function (req, res, next) {
    let ens = req.url.split('/')[2];

    let contests = await db.query('select _hash, _start, _voting, _end, prompt_data->>\'title\' as _title, prompt_data->>\'promptLabelColor\' as _prompt_label_color, prompt_data->>\'promptLabel\' as _prompt_label from contests where ens = $1 order by created asc', [ens])
        .then(clean)
        .then(asArray)

    res.send(contests).status(200)
})

// fetch the latest contest for an organization
contests.get('/fetch_contest/*', async function (req, res, next) {
    let ens = req.url.split('/')[2];
    let contest_hash = req.url.split('/')[3];


    // will there be conditions where latest is not the current active contest? need to handle that if so.
    let data = await db.query('select settings, prompt_data from contests where ens = $1 and _hash = $2', [ens, contest_hash])
        .then(clean)

    res.send(data).status(200)
})


// fetch submissions

contests.get('/fetch_submissions/*', async function (req, res, next) {
    let ens = req.url.split('/')[2];
    let contest_hash = req.url.split('/')[3];
    let subs = await db.query('select id, _url from contest_submissions where ens = $1 and contest_hash = $2', [ens, contest_hash])
        .then(clean)
        .then(asArray)
    res.send(subs).status(200)
})

// create a contest

// TURTLES protect this
contests.post('/create_contest', authenticateToken, isAdmin, createContest, async function (req, res, next) {
    const { ens, contest_settings, prompt_data } = req.body
    const { start_date, voting_begin, end_date } = contest_settings.date_times
    await db.query('insert into contests (ens, created, _start, _voting, _end, _hash, settings, prompt_data, locked, pinned) values ($1, $2, $3, $4, $5, $6, $7, $8, false, false)', [ens, req.created, start_date, voting_begin, end_date, req.hash, contest_settings, prompt_data])
    res.sendStatus(200)
})


///////////////////////////// begin submissions ////////////////////////////////////


contests.post('/create_submission', authenticateToken, checkSubmissionRestrictions, checkUserSubmissions, createSubmission, async function (req, res, next) {
    const { ens } = req.body;
    await db.query('insert into contest_submissions (ens, contest_hash, author, created, locked, pinned, _url) values ($1, $2, $3, $4, $5, $6, $7)', [ens, req.contest_hash, req.user.address, req.created, false, false, req.url])
    res.status(200)
})

const getUserSubmissions = async (walletAddress, contest_hash) => {
    let result = await db.query('select * from contest_submissions where contest_hash = $1 and author = $2', [contest_hash, walletAddress])
        .then(clean)
        .then(asArray)
    return result
}

contests.post('/get_user_submissions', authenticateToken, async function (req, res, next) {
    let { contest_hash } = req.body

    let subs = await getUserSubmissions(req.user.address, contest_hash)
    res.send(subs).status(200)

})


contests.post('/check_user_eligibility', checkSubmitterEligibility, async function (req, res, next) {

    const data = {
        restrictions: req.restrictions_with_results,
        has_already_submitted: req.has_already_submitted
    }


    res.send(data).status(200)
})

///////////////////////////// end submissions ////////////////////////////////////


///////////////////////////// begin voting ////////////////////////////////////

contests.post('/user_voting_metrics', checkVoterEligibility, getContestVotingStrategy, calculateSubmissionVotingPower, async function (req, res, next) {
    let result = {
        metrics: {
            sub_total_vp: req.sub_total_vp,
            sub_votes_spent: req.sub_votes_spent,
            sub_remaining_vp: req.sub_remaining_vp,
        },
        restrictions_with_results: req.restrictions_with_results
    }
    res.send(result).status(200)
})


// TURTLES protect this
// authenticate user, check restrictions, get strategy, check voting power
contests.post('/cast_vote', authenticateToken, checkVoterRestrictions, getContestVotingStrategy, verifyVotingPower, async function (req, res, next) {
    let { contest_hash, sub_id, num_votes } = req.body;
    let walletAddress = req.user.address
    if (req.verified) {
        let result = await db.query('insert into contest_votes (contest_hash, submission_id, voter, votes_spent)\
                                values ($1, $2, $3, $4)\
                                on conflict (voter, submission_id)\
                                do update set votes_spent = $4\
                                returning votes_spent',
            [contest_hash, sub_id, walletAddress, num_votes])
            .then(clean)
            .then(data => {
                return JSON.stringify(data.votes_spent)
            })

        res.send(result).status(200)
    }
    else {
        res.sendStatus(419)
    }

})

// TURTLES protect this
contests.post('/retract_sub_votes', async function (req, res, next) {
    let { sub_id, walletAddress } = req.body;
    db.query('delete from contest_votes where submission_id = $1 and voter = $2', [sub_id, walletAddress])
        .then(() => res.sendStatus(200))

})

///////////////////////////// end voting ////////////////////////////////////

///////////////////////////// begin stats ////////////////////////////////////

contests.get('/org_contest_stats/*', async function (req, res, next) {
    let ens = req.url.split('/')[2];
    await db.query('select settings ->> \'submitter_rewards\' as rewards from contests where ens=$1', [ens/*, new Date().toISOString()*/])
        .then(clean)
        .then(asArray)
        .then(data => {
            let obj = { eth: 0, erc20: 0, erc721: 0 }
            if (data.length === 1) {
                let parsed = Object.values(JSON.parse(data[0].rewards))
                parsed.map(inner => {
                    obj[Object.keys(inner)[0]] += inner[Object.keys(inner)[0]].amount
                })
            }
            else {
                data.map(el => {
                    let parsed = Object.values(JSON.parse(el.rewards))
                    parsed.map(inner => {
                        obj[Object.keys(inner)[0]] += inner[Object.keys(inner)[0]].amount
                    })
                })
            }
            return obj
        })
        .then(data => res.send(data).status(200))
})


///////////////////////////// end stats ////////////////////////////////////

// used for lazy uploading assets in contest submissions

contests.post('/upload_img', imageUpload.single('image'), async (req, res) => {


    console.log(req.file)

    let img_data = {
        success: 1,
        file: {
            url: '/' + req.file.path
        }
    }
    res.status(200).send(img_data)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


///////////////////////// begin dev / test routes ////////////////////////////////////
dotenv.config()
if (process.env.NODE_ENV === 'test') {

    contests.post('/test_delete_dummy', async (req, res) => {
        try {
            await db.query('delete from contests where ens=$1', ['dev_testing.eth']);
            await db.query('delete from contest_submissions where ens=$1', ['dev_testing.eth'])
            await db.query('delete from contest_votes where voter=$1', ['dev_testing.eth'])
            res.sendStatus(200);
        } catch (e) { console.log(e) }//res.sendStatus(401) }
    })


    contests.post('/test_create_submission', async (req, res) => {
        const { ens, contest_hash } = req.body
        let id = await db.query('insert into contest_submissions (ens, contest_hash, created, locked, pinned, _url) values ($1, $2, $3, $4, $5, $6) returning id', [ens, contest_hash, new Date().toISOString(), true, true, 'dummy.json']).then(clean)
        res.send(JSON.stringify(id)).status(200)
    })

}


///////////////////////// end dev / test routes ////////////////////////////////////




module.exports.contests = contests;