const express = require('express');
const db = require('../helpers/db-init.js')
const dotenv = require('dotenv')
const path = require('path')
const contests = express();
contests.use(express.json())
const { authenticateToken } = require('../middlewares/jwt-middleware.js');
const { isAdmin } = require('../middlewares/admin-middleware')
const { clean, asArray } = require('../helpers/common')
const { createContest, isNick } = require('../middlewares/creator-contests/create-contest-middleware');
const { check_submitter_eligibility_unprotected, check_submitter_eligibility_PROTECTED, createSubmission } = require('../middlewares/creator-contests/submit-middleware');
const { imageUpload } = require('../middlewares/image-upload-middleware.js');
const { calc_sub_vp__unprotected, calc_sub_vp__PROTECTED } = require('../middlewares/creator-contests/vote-middleware-2.js');
const logger = require('../logger').child({ component: 'creator-contests' })
const { sendSocketMessage } = require('../sys/socket/socket-io');
const { get_winners, get_winners_as_csv, verifyContestOver } = require('../middlewares/creator-contests/fetch-winners-middleware.js');

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
    let subs = await db.query('select id, _url from contest_submissions where ens=$1 and contest_hash=$2', [ens, contest_hash])
        .then(clean)
        .then(asArray)
    res.send(subs).status(200)
})

/*
contests.get('/fetch_submissions/*', async function (req, res, next) {
    let ens = req.url.split('/')[2];
    let contest_hash = req.url.split('/')[3];
    let subs = await db.query('select contest_submissions.id,\
                            contest_submissions._url,\
                            case when (contests.settings->>\'visible_votes\')::boolean = false then null else contest_votes.votes_spent end as votes,\
                            case when (contests.settings->>\'anon_subs\')::boolean = true then null else contest_submissions.author end as author\
                            from contests\
                            left join contest_submissions\
                            on contests._hash = contest_submissions.contest_hash\
                            left join contest_votes\
                            on contests._hash = contest_votes.contest_hash\
                            where contests.ens = $1 and contest_submissions.contest_hash = $2', [ens, contest_hash])
        .then(clean)
        .then(asArray)
    console.log(subs)
    res.send(subs).status(200)
})
*/

// fetch all the winners for a contest
// get the reward strategy
// return the url, author, num votes, reward
// check window last

contests.get('/fetch_contest_winners', verifyContestOver, async function (req, res, next) {
    const { ens, contest_hash } = req.query
    let subs_full_details = await db.query('select contest_submissions.id, _url, author, coalesce(sum(votes_spent), 0) as votes from contest_submissions left join contest_votes on contest_submissions.id = contest_votes.submission_id where contest_submissions.ens=$1 and contest_submissions.contest_hash=$2 group by contest_submissions.id order by votes desc', [ens, contest_hash])
        .then(clean)
        .then(asArray)
    res.send(subs_full_details).status(200);

})

contests.get('/fetch_contest_winners_as_csv', get_winners_as_csv, async function (req, res, next) {
    const { ens, contest_hash } = req.query
    let result = req.csvContent
    res.send(result).status(200);

})

// create a contest

contests.post('/create_contest', authenticateToken, isAdmin, isNick, createContest, async function (req, res, next) {
    const { ens, contest_settings, prompt_data } = req.body
    const { start_date, voting_begin, end_date } = contest_settings.date_times
    await db.query('insert into contests (ens, created, _start, _voting, _end, _hash, settings, prompt_data, locked, pinned) values ($1, $2, $3, $4, $5, $6, $7, $8, false, false)', [ens, req.created, start_date, voting_begin, end_date, req.hash, contest_settings, prompt_data])
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


contests.post('/create_submission', authenticateToken, check_submitter_eligibility_PROTECTED, /*checkSubmissionRestrictions, checkUserSubmissions,*/ createSubmission, async function (req, res, next) {
    const { ens } = req.body;
    let result = await db.query('insert into contest_submissions (ens, contest_hash, author, created, locked, pinned, _url) values ($1, $2, $3, $4, $5, $6, $7) returning id ', [ens, req.contest_hash, req.user.address, req.created, false, false, req.url]).then(clean)
    res.sendStatus(200)
    sendSocketMessage(req.contest_hash, 'new_submission', { id: result.id, _url: req.url })

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


contests.post('/check_user_eligibility', check_submitter_eligibility_unprotected, async function (req, res, next) {

    const data = {
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


// authenticate user, check restrictions, get strategy, check voting power
contests.post('/cast_vote', authenticateToken, calc_sub_vp__PROTECTED, async function (req, res, next) {
    let { contest_hash, sub_id, num_votes } = req.body;
    let walletAddress = req.user.address
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
    db.query('delete from contest_votes where submission_id = $1 and voter = $2', [sub_id, req.user.address])
        .then(() => res.sendStatus(200))

})

///////////////////////////// end voting ////////////////////////////////////

///////////////////////////// begin stats ////////////////////////////////////

contests.get('/org_contest_stats/*', async function (req, res, next) {

    let ens = req.url.split('/')[2];
    await db.query('select settings ->> \'submitter_rewards\' as rewards from contests where ens=$1', [ens])
        .then(clean)
        .then(asArray)
        .then(data => {
            let obj = { eth: 0, erc20: 0, erc721: 0 }
            console.log('begin case')

            if (data.length === 1) {
                console.log('first case')

                let parsed = Object.values(JSON.parse(data[0].rewards))
                parsed.map(inner => {
                    obj[Object.keys(inner)[0]] += inner[Object.keys(inner)[0]].amount
                })
            }
            else {
                console.log('this case')
                data.map(el => {
                    let parsed = Object.values(JSON.parse(el.rewards))
                    parsed.map(inner => {
                        let { rank, ...reward } = inner
                        let vals = Object.values(reward)[0]
                        //obj[Object.keys(inner)[0]] += inner[Object.keys(inner)[0]].amount
                        obj[vals.type] += vals.amount
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


contests.post('/user_voting_metrics_alt', calc_sub_vp__unprotected, async function (req, res, next) {
    let result = {
        metrics: {
            sub_total_vp: req.sub_total_vp,
            sub_votes_spent: req.sub_votes_spent,
            sub_remaining_vp: req.sub_remaining_vp,
        },
        restrictions_with_results: req.restrictions_with_results,
    }
    res.send(result).status(200)
})

///////////////////////// end dev / test routes ////////////////////////////////////




module.exports.contests = contests;