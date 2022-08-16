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
const { getGuildRoles } = require('./discord-routes');
const { createContest, createSubmission, createSubmission2 } = require('../middlewares/create-contest-middleware.js');
const { imageUpload } = require('../middlewares/image-upload-middleware.js');
const { json } = require('body-parser');
const logger = require('../logger').child({ component: 'creator-contests' })

const serverRoot = path.normalize(path.join(__dirname, '../'));


//const contestLogger = logger.child({ service: 'creator-contests' })


// fetch the indexes of all contests, in order

// fetch the submissions for a contest

// fetch the settings for a contest
contests.get('/fetch_org_contests/*', async function (req, res, next) {
    let ens = req.url.split('/')[2];

    let contests = await db.query('select * from contests where ens = $1 order by created asc', [ens]).then(clean).then(asArray)

    res.send(contests).status(200)
})

// fetch the latest contest for an organization
contests.get('/fetch_contest/*', async function (req, res, next) {
    let ens = req.url.split('/')[2];
    let contest_hash = req.url.split('/')[3];


    // will there be conditions where latest is not the current active contest? need to handle that if so.
    let latest = await db.query('select _url from contests where ens = $1 and _hash = $2', [ens, contest_hash]).then(clean)

    fs.createReadStream(path.join(serverRoot, latest._url, 'settings.json'))
        .on('end', function () {
            logger.log({ level: 'info', message: 'fetch contest stream success' })
        })
        .on('error', function (err) {
            res.send(err)
        })
        .pipe(res)
})


// fetch submissions

contests.get('/fetch_submissions/*', async function (req, res, next) {
    let ens = req.url.split('/')[2];
    let contest_hash = req.url.split('/')[3];
    let subs = await db.query('select id, _url from contest_submissions where ens = $1 and contest_hash = $2', [ens, contest_hash]).then(clean).then(asArray)
    res.send(subs).status(200)
})

// create a contest

contests.post('/create_contest', createContest, async function (req, res, next) {

    const { ens, contest_settings } = req.body
    const { start_date, end_date } = contest_settings.date_times
    let _url = `creator-contests/${ens}/${req.hash}/`
    await db.query('insert into contests (ens, created, _start, _end, _hash, _url) values ($1, $2, $3, $4, $5, $6)', [ens, req.created, start_date, end_date, req.hash, _url])
    // gen a hash, save file to location, write to db
    res.sendStatus(200)
})


contests.post('/create_submission', createSubmission2, async function (req, res, next) {
    console.log('submission rx!')
    console.log(req.contest_hash);
    console.log(req.url);
    console.log(req.created);
    const { ens } = req.body;
    await db.query('insert into contest_submissions (ens, contest_hash, created, locked, pinned, _url) values ($1, $2, $3, $4, $5, $6)', [ens, req.contest_hash, req.created, false, false, req.url])

    res.sendStatus(200)
})

///////////////////////////// begin voting ////////////////////////////////////

contests.post('/fetch_user_spent_votes/', async function (req, res, next) {
    let { sub_id, walletAddress, contest_hash } = req.body

    let result = await db.query('select votes_spent from contest_votes where contest_hash = $1 and submission_id = $2 and voter = $3', [contest_hash, sub_id, walletAddress])
        .then(clean)
        .then(data => {
            if (data) return data
            else return { votes_spent: 0 }
        }).then(num => JSON.stringify(num))

    console.log(result)
    res.send(result).status(200)

})

contests.post('/cast_vote', async function (req, res, next) {
    let { contest_hash, sub_id, walletAddress, num_votes } = req.body;
    let result = await db.query('insert into contest_votes (contest_hash, submission_id, voter, votes_spent)\
                                values ($1, $2, $3, $4)\
                                on conflict (voter, submission_id)\
                                do update set votes_spent = contest_votes.votes_spent + $4\
                                returning votes_spent',
        [contest_hash, sub_id, walletAddress, num_votes])
        .then(clean)
        .then(data => {
            return JSON.stringify(data.votes_spent)
        })

    console.log(result)

    res.send(result).status(200)

})

contests.post('/retract_sub_votes', async function (req, res, next) {
    let { sub_id, walletAddress } = req.body;
    let result = await db.query('delete from contest_votes where submission_id = $1 and voter = $2', [sub_id, walletAddress])
    res.sendStatus(200)
})

///////////////////////////// end voting ////////////////////////////////////


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

module.exports.contests = contests;