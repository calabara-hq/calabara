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
const { createContest, createSubmission } = require('../middlewares/create-contest-middleware.js');


const serverRoot = path.normalize(path.join(__dirname, '../'));


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

    let filestream = fs.createReadStream(path.join(serverRoot, latest._url, 'settings.json'))
        .on('end', function () {
            console.log('stream done')
        })
        .on('error', function (err) {
            res.send(err)
        })
        .pipe(res)
})


// fetch submissions

contests.get('/fetch_submissions/*', async function (req, res, next) {


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


contests.post('/create_submission', createSubmission, async function (req, res, next) {
    console.log('submission rx!')
    const { ens, submission } = req.body;
    const _url = `creator-contests/${ens}/${req.contest_hash}/submissions/${req.submission_hash}/`

    console.log(submission)
    await db.query('insert into contest_submissions (ens, contest_hash, created, _hash, _url) values ($1, $2, $3, $4, $5)', [ens, req.contest_hash, req.created, req.submission_hash, _url])
    res.sendStatus(200)
})




module.exports.contests = contests;