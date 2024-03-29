const express = require('express');
const db = require('../helpers/db-init.js')
const dotenv = require('dotenv')
const path = require('path')
const contests = express();
contests.use(express.json())
const { authenticateToken } = require('../middlewares/auth-middleware.js');
const { isAdmin } = require('../middlewares/admin-middleware')
const { clean, asArray, shuffleArray } = require('../helpers/common')
const { createContest } = require('../middlewares/creator-contests/create-contest-middleware');
const { check_submitter_eligibility_unprotected, check_submitter_eligibility_PROTECTED, createSubmission } = require('../middlewares/creator-contests/submit-middleware');
const { imageUpload, twitterMediaUpload, fileSizeLimitErrorHandler } = require('../middlewares/image-upload-middleware.js');
const { calc_sub_vp__unprotected, calc_sub_vp__PROTECTED, calc_total_vp_UNPROTECTED } = require('../middlewares/creator-contests/vote-middleware.js');
const logger = require('../logger').child({ service: 'contest_api' })
const { get_winners_as_csv, verifyContestOver } = require('../middlewares/creator-contests/fetch-winners-middleware.js');
const { fetchSubmissions } = require('../middlewares/creator-contests/fetch-submissions-middleware.js');
const { socketSendNewSubmission, socketSendUserSubmissionStatus } = require('../helpers/socket-messages.js');
const { uploadTwitterMedia } = require('../middlewares/twitter-upload-media.js');
const { add_stream_rules } = require('../twitter-client/stream.js');
dotenv.config()

const serverRoot = path.normalize(path.join(__dirname, '../'));


contests.get('/fetch_org_contests/*', async function (req, res, next) {
    let ens = req.url.split('/')[2];

    let contests = await db.query('select _hash, _start, _voting, _end, prompt_data->>\'title\' as _title, prompt_data->>\'promptLabelColor\' as _prompt_label_color, prompt_data->>\'promptLabel\' as _prompt_label from contests where ens = $1 order by created asc', [ens])
        .then(clean)
        .then(asArray)

    res.send(contests).status(200)
})

// fetch the latest contest for an organization
contests.get('/fetch_contest', async function (req, res, next) {
    const { ens, contest_hash } = req.query

    // will there be conditions where latest is not the current active contest? need to handle that if so.
    let data = await db.query('select settings, prompt_data from contests where ens = $1 and _hash = $2', [ens, contest_hash])
        .then(clean)

    if (data === null) {
        logger.log({ level: 'error', message: 'attmpt to access non-existing contest' })
        return res.sendStatus(404)
    }
    res.send(data).status(200)
})


// fetch submissions

contests.get('/fetch_submissions', fetchSubmissions, async function (req, res, next) {
    res.send(req.submissions).status(200)
})


contests.get('/fetch_contest_winners_as_csv', get_winners_as_csv, async function (req, res, next) {
    const { ens, contest_hash, format } = req.query
    let result = req.csvContent
    res.send(result).status(200);

})

// create a contest

contests.post('/create_contest', authenticateToken, isAdmin, createContest, async function (req, res, next) {
    const { ens, contest_settings, prompt_data } = req.body
    const { start_date, voting_begin, end_date } = contest_settings.date_times
    await db.query('insert into contests (ens, created, _start, _voting, _end, _hash, settings, prompt_data, locked, pinned) values ($1, $2, $3, $4, $5, $6, $7, $8, false, false)', [ens, req.created, start_date, voting_begin, end_date, req.hash, contest_settings, prompt_data])
    if (contest_settings.twitter_integration) {
        add_stream_rules([{ value: `conversation_id:${contest_settings.twitter_integration.announcementID} is:quote`, tag: req.hash }])
    }
    res.sendStatus(200)
})

/*
TURTLES come back and implement vote streaming
// if in voting window and contest is configured for active voting, return the votes
contests.get('/fetch_submission_votes', async function (req, res, next) {
    const { ens, contest_hash, sub_id } = req.query;
    
})
*/

///////////////////////////// begin submissions ////////////////////////////////////


contests.post('/create_submission', authenticateToken, check_submitter_eligibility_PROTECTED, createSubmission, async function (req, res, next) {
    const { ens } = req.body;
    let result = await db.query('insert into contest_submissions (ens, contest_hash, author, created, locked, pinned, _url) values ($1, $2, $3, $4, $5, $6, $7) returning id ', [ens, req.contest_hash, req.session.user.address, req.created, false, false, req.url]).then(clean)
    res.sendStatus(200)
    socketSendNewSubmission(req.contest_hash, ens, { id: result.id, _url: req.url, author: req.session.user.address, votes: 0 })
    socketSendUserSubmissionStatus(req.session.user.address, req.contest_hash, 'submitted')

})

const getUserSubmissions = async (walletAddress, contest_hash) => {
    let result = await db.query('select * from contest_submissions where contest_hash = $1 and author = $2', [contest_hash, walletAddress])
        .then(clean)
        .then(asArray)
    return result
}

contests.post('/get_user_submissions', authenticateToken, async function (req, res, next) {
    let { contest_hash } = req.body

    let subs = await getUserSubmissions(req.session.user.address, contest_hash)
    res.send(subs).status(200)

})


contests.post('/check_user_eligibility', check_submitter_eligibility_unprotected, async function (req, res, next) {
    const data = {
        is_pending: req.is_pending,
        restrictions: req.restrictions_with_results,
        has_already_submitted: req.has_already_submitted,
        is_submit_window: req.is_submit_window
    }


    res.send(data).status(200)
})



///////////////////////////// end submissions ////////////////////////////////////


///////////////////////////// begin voting ////////////////////////////////////

contests.post('/user_voting_metrics', calc_sub_vp__unprotected, async function (req, res, next) {
    let result = {
        metrics: {
            sub_total_vp: req.sub_total_vp,
            sub_votes_spent: req.sub_votes_spent,
            sub_remaining_vp: req.sub_remaining_vp,
        },
        restrictions_with_results: req.restrictions_with_results,
        is_self_voting_error: req.is_self_voting_error
    }
    res.send(result).status(200)
})

contests.post('/user_total_voting_metrics', calc_total_vp_UNPROTECTED, async function (req, res, next) {
    let result = {
        metrics: {
            contest_total_vp: req.contest_total_vp,
            contest_remaining_vp: req.contest_remaining_vp,
        }
    }
    res.send(result).status(200)
})


// authenticate user, check restrictions, get strategy, check voting power
contests.post('/cast_vote', authenticateToken, calc_sub_vp__PROTECTED, async function (req, res, next) {
    let { contest_hash, sub_id, num_votes } = req.body;
    let walletAddress = req.session.user.address
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

})

contests.post('/retract_sub_votes', authenticateToken, async function (req, res, next) {
    let { sub_id } = req.body;
    db.query('delete from contest_votes where submission_id = $1 and voter = $2', [sub_id, req.session.user.address])
        .then(() => res.sendStatus(200))

})

///////////////////////////// end voting ////////////////////////////////////

///////////////////////////// begin stats ////////////////////////////////////

contests.get('/org_contest_stats', async function (req, res, next) {
    const { ens } = req.query
    await db.query('select settings ->> \'submitter_rewards\' as rewards from contests where ens=$1', [ens])
        .then(clean)
        .then(asArray)
        .then(data => {
            let obj = { eth: 0, erc20: 0, erc721: 0 }
            if (data.length === 0) return obj
            data.map(el => {
                let parsed = Object.values(JSON.parse(el.rewards))
                parsed.map(inner => {
                    let { rank, ...reward } = inner
                    let vals = Object.values(reward)[0]
                    obj[vals.type] += vals.amount || 1 // 1 is the case that this is an nft reward
                })
            })
            return obj
        })
        .then(data => res.send(data).status(200))

})


///////////////////////////// end stats ////////////////////////////////////

contests.post('/upload_img', imageUpload.single('image'), async (req, res) => {


    let img_data = {
        success: 1,
        file: {
            url: '/' + req.file.path
        }
    }
    res.status(200).send(img_data)
}, (error, req, res, next) => {
    logger.log({ level: 'error', message: `failed to upload media with error: ${error.message}` })
    res.status(400).send({ error: error.message })
})



contests.post('/twitter_contest_upload_img', twitterMediaUpload.single('image'), fileSizeLimitErrorHandler, uploadTwitterMedia, async (req, res) => {

    let img_data = {
        success: 1,
        file: {
            url: '/' + req.file.path,
            media_id: req.file.media_id
        }
    }
    res.status(200).send(img_data)
}, (error, req, res, next) => {
    logger.log({ level: 'error', message: `failed to upload twitter media with error: ${error.message}` })
    res.status(400).send({ error: error.message })
})



///////////////////////// begin dev / test routes ////////////////////////////////////
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
        const { ens, contest_hash, author } = req.body
        let id = await db.query('insert into contest_submissions (ens, contest_hash, author, created, locked, pinned, _url) values ($1, $2, $3, $4, $5, $6, $7) returning id', [ens, contest_hash, author, new Date().toISOString(), true, true, 'dummy.json']).then(clean)
        res.send(JSON.stringify(id)).status(200)
    })

}


///////////////////////// end dev / test routes ////////////////////////////////////




module.exports.contests = contests;