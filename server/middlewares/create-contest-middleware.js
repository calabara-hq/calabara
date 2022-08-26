const path = require('path')
const crypto = require('crypto')
const serverRoot = path.normalize(path.join(__dirname, '../'));
const asyncfs = require('fs').promises;
const fs = require('fs');
const { pinFromFs, pinJSON } = require('../helpers/ipfs-api');
const db = require('../helpers/db-init.js');
const { clean, asArray } = require('../helpers/common')
const { checkWalletTokenBalance } = require('../web3/web3')
// generate a contest identifier hash

// create folder with hash and writestream and write file to disk

// pass hash and timestamp to endpoint



async function createContest(req, res, next) {
    const { ens, contest_settings } = req.body;
    contest_settings.created = new Date().toISOString();
    let hash = crypto.createHash('md5').update(JSON.stringify(contest_settings)).digest('hex').slice(-8);
    contest_settings.hash = hash;
    let destination = `creator-contests/${ens}/${hash}/`

    // add the img folder while we're at it

    /*
    await asyncfs.mkdir(`${destination}/img`, { recursive: true }, (err) => {
        if (err) return res.sendStatus(401)
        req.hash = hash;
        req.created = contest_settings.created;
        next();
    })
    */
    req.hash = hash;
    req.created = contest_settings.created;
    next();
}

async function checkSubmissionRestrictions(req, res, next) {
    const walletAddress = req.user.address;
    const { ens, submission, contest_hash } = req.body;

    let restrictions = await db.query('select settings->>\'submitter_restrictions\' as restrictions from contests where ens = $1 and _hash = $2', [ens, contest_hash])
        .then(clean)
        .then(res => Object.values(JSON.parse(res.restrictions)))


    for (const restriction of restrictions) {
        if (restriction.type === 'erc20' || restriction.type === 'erc721') {
            let result = await checkWalletTokenBalance(walletAddress, restriction.address, restriction.decimal)
            if (result > restriction.threshold) {
                next();
            }
        }
    }

    res.status(419)
}

// same as above, but check and return results for all rules

async function checkEligibility(req, res, next) {
    const walletAddress = req.user.address;
    const { ens, submission, contest_hash } = req.body;

    let restrictions = await db.query('select settings->>\'submitter_restrictions\' as restrictions from contests where ens = $1 and _hash = $2', [ens, contest_hash])
        .then(clean)
        .then(res => Object.values(JSON.parse(res.restrictions)))


    for (const restriction of restrictions) {
        if (restriction.type === 'erc20' || restriction.type === 'erc721') {
            let result = await checkWalletTokenBalance(walletAddress, restriction.address, restriction.decimal)
                restriction.user_result = result > restriction.threshold
        }
    }

    req.restrictions_with_results = restrictions;
    next();
}

async function checkUserSubmissions(req, res, next) {
    console.log('HERE')
    const walletAddress = req.user.address;
    const { ens, submission, contest_hash } = req.body;

    let submissions = await db.query('select id from contest_submissions where ens = $1 and contest_hash=$2 and author=$3', [ens, contest_hash, walletAddress])
        .then(clean)
        .then(asArray)

    console.log(submissions.length)
    if (submissions.length < 1) {
        next();
    }

    res.status(420)

}


async function createSubmission(req, res, next) {
    const { ens, submission, contest_hash } = req.body;

    // make sure we are in the submission window
    let created = new Date().toISOString();

    let dates = await db.query('select _start, _voting from contests where ens = $1 and _hash=$2', [ens, contest_hash])
    .then(clean)

    if(!(dates._start < created < dates._voting)){
        return res.sendStatus(432)
    }

    console.log(submission)

    let submission_hash = crypto.createHash('md5').update(JSON.stringify(submission)).digest('hex').slice(-8);

    let destination_folder = `contest-assets/staging/submissions/${submission_hash}`
    let submission_url = `${destination_folder}.json`

    const writestream = fs.createWriteStream(path.join(serverRoot, submission_url))
    writestream.write(JSON.stringify(submission), err => {
        if (err) console.log(err, 'submission write failure');
        req.contest_hash = contest_hash;
        req.url = '/' + submission_url;
        req.created = created;
        next();
    })

}


module.exports = { createContest, checkSubmissionRestrictions, checkUserSubmissions, checkEligibility, createSubmission };