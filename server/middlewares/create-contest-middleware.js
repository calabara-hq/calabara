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
        else if (restriction.type === 'discord') {
            console.log(restriction)
        }
    }

    req.restrictions_with_results = restrictions;
    next();
}

async function checkUserSubmissions(req, res, next) {
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

    if (!(dates._start < created && created < dates._voting)) {
        return res.sendStatus(432)
    }

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

/////////////////////////// begin voting ////////////////////////////////////
/**
 * 
 * get strategy --> check tokens --> calculate vp --> return
 */


let strategy1 = {
    type: 'arcade',
    hard_cap: 50,
    sub_cap: 0,
}

let strategy2 = {
    type: 'token',
    sybmbol: 'SHARK',
    address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
    decimal: 18,
    hard_cap: 50,
    sub_cap: 0
}


async function getContestVotingStrategy(req, res, next) {
    req.strategy = strategy2;
    next();
}

/**
 * if arcade style, compute hard_cap || sub_cap - votes spent
 * if token style, compute holding || hard_cap - votes spent 
 * */
async function calculateVotingPower(req, res, next) {
    const { ens, sub_id, walletAddress, contest_hash } = req.query;
    
    db.query('select votes_spent from contest_votes where contest_hash = $1 and submission_id = $2 and voter = $3', [contest_hash, sub_id, walletAddress])

    let voting_power = 0;

   

    if (req.strategy.type === 'arcade') {
        voting_power = req.strategy.hard_cap;
    }
    else if (req.strategy.type === 'token') {
        voting_power = userTokenBalance = await checkWalletTokenBalance(walletAddress, req.strategy.address, req.strategy.decimal);
    }

    // if hardcap is applied and hardcap < voting power, set use hardcap as max vp

    if (req.strategy.hard_cap !== 0 && req.strategy.hard_cap < Math.floor(userTokenBalance)) voting_power = req.strategy.hard_cap
    

    if (req.strategy.sub_cap !== 0 && req.strategy.sub_cap < Math.floor(userTokenBalance)) voting_power = req.strategy.sub_cap

    req.voting_power = voting_power;
    next();


    res.status(419)

}

/*
async function calculateVotingPower(req, res, next) {
    const { ens, contest_hash, sub_id } = req.body;
    db.query('select votes_spent from contest_votes where contest_hash = $1 and submission_id = $2 and voter = $3', [contest_hash, sub_id, req.user.address])
        .then(clean)
        .then(data => {
            
            console.log(data)
            //if (data) console.log(data)//return data
            //else return { votes_spent: 0 }
        }).then(num => JSON.stringify(num))
}

*/

/////////////////////////// end voting ////////////////////////////////////


module.exports = {
    createContest,
    checkSubmissionRestrictions,
    checkUserSubmissions,
    checkEligibility,
    createSubmission,
    getContestVotingStrategy,
    calculateVotingPower,
};