const path = require('path')
const crypto = require('crypto')
const serverRoot = path.normalize(path.join(__dirname, '../../'));
const asyncfs = require('fs').promises;
const fs = require('fs');
const { pinFromFs, pinJSON } = require('../../helpers/ipfs-api');
const db = require('../../helpers/db-init.js');
const { clean, asArray } = require('../../helpers/common')
const { checkWalletTokenBalance } = require('../../web3/web3')


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
// also check if user submitted previously
// this route is also unprotected

async function checkSubmitterEligibility(req, res, next) {
    const { ens, walletAddress, contest_hash } = req.body;

    let [restrictions, user_submissions] = await Promise.all([
        db.query('select settings->>\'submitter_restrictions\' as restrictions from contests where ens = $1 and _hash = $2', [ens, contest_hash])
            .then(clean)
            .then(res => Object.values(JSON.parse(res.restrictions))),

        db.query('select id from contest_submissions where ens = $1 and contest_hash=$2 and author=$3', [ens, contest_hash, walletAddress])
            .then(clean)
            .then(asArray)

    ])

    for (const restriction of restrictions) {
        if (restriction.type === 'erc20' || restriction.type === 'erc721') {
            let result = await checkWalletTokenBalance(walletAddress, restriction.address, restriction.decimal)
            restriction.user_result = result > restriction.threshold
        }
    }


    req.has_already_submitted = user_submissions.length > 0
    req.restrictions_with_results = restrictions;
    next();
}



async function checkUserSubmissions(req, res, next) {
    const walletAddress = req.user.address;
    const { ens, contest_hash } = req.body;

    let submissions = await db.query('select id from contest_submissions where ens = $1 and contest_hash=$2 and author=$3', [ens, contest_hash, walletAddress])
        .then(clean)
        .then(asArray)

    console.log(submissions.length)


    // TURTLES COME BACK AND UNCOMMENT THIS LINE
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

    if (!(dates._start < created && created < dates._voting)) {
        return res.sendStatus(432)
    }

    submission.created = created;

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




module.exports = {
    checkSubmissionRestrictions,
    checkUserSubmissions,
    checkSubmitterEligibility,
    createSubmission
};