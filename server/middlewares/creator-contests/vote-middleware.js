const path = require('path')
const crypto = require('crypto')
const serverRoot = path.normalize(path.join(__dirname, '../../'));
const asyncfs = require('fs').promises;
const fs = require('fs');
const { pinFromFs, pinJSON } = require('../../helpers/ipfs-api');
const db = require('../../helpers/db-init.js');
const { clean, asArray } = require('../../helpers/common')
const { checkWalletTokenBalance } = require('../../web3/web3')

///////////////////////// begin protected /////////////////
// protected route. return if any of the rules are passed
async function checkVoterRestrictions(req, res, next) {
    const { ens, contest_hash } = req.body;
    const walletAddress = req.user.address;
    let restrictions = await db.query('select settings->>\'voter_restrictions\' as restrictions from contests where ens = $1 and _hash = $2', [ens, contest_hash])
        .then(clean)
        .then(res => Object.values(JSON.parse(res.restrictions)))

    // check the times


    if (restrictions.length === 0) {
        return next();
    }

    for (const restriction of restrictions) {
        if (restriction.type === 'erc20' || restriction.type === 'erc721') {
            let result = await checkWalletTokenBalance(walletAddress, restriction.address, restriction.decimal)
            restriction.user_result = result > restriction.threshold
            if (result > restriction.threshold) {
                return next();
            }
        }
    }

    res.sendStatus(419)

}


// calculate vp for a single submission
async function verifyVotingPower(req, res, next) {
    const { ens, sub_id, contest_hash, num_votes } = req.body;
    const walletAddress = req.user.address


    let [is_voting_window, total_contest_spent, sub_spent, total_contest_vp] = await Promise.all([
        verifyVotingWindow(ens, contest_hash),
        getTotalSpentVotes(contest_hash, walletAddress),
        getSubmissionSpentVotes(contest_hash, sub_id, walletAddress),
        getTotalVotingPower(req.strategy, walletAddress)
    ])


    let total_votes_available = total_contest_vp - (total_contest_spent - sub_spent)
    let submission_votes_available = Math.min(total_votes_available, req.strategy.sub_cap || total_votes_available)

    req.sub_total_vp = submission_votes_available;
    req.sub_votes_spent = sub_spent;
    req.sub_remaining_vp = submission_votes_available - sub_spent;
    req.verified = num_votes <= submission_votes_available;


    next();

}

/////////////////////////// end protected //////////////////


// unprotected. return all rule results for UI purposes
async function checkVoterEligibility(req, res, next) {
    const { ens, walletAddress, contest_hash } = req.body;

    let restrictions = await db.query('select settings->>\'voter_restrictions\' as restrictions from contests where ens = $1 and _hash = $2', [ens, contest_hash])
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

/*
 * get strategy --> check tokens --> calculate vp --> return
 */


async function getContestVotingStrategy(req, res, next) {
    const { ens, contest_hash } = req.body
    let strategy = await db.query('select settings ->> \'voting_strategy\' as strategy from contests where ens=$1 and _hash=$2', [ens, contest_hash])
        .then(clean)
        .then(data => JSON.parse(data.strategy))
    req.strategy = strategy;
    next();
}

async function verifyVotingWindow(ens, contest_hash) {
    let window = await db.query('select _voting, _end from contests where ens=$1 and _hash=$2', [ens, contest_hash])
        .then(clean)
    if (!(window._voting < created && created < dates._end)) {
        return res.sendStatus(433)
    }
    return true
}

const getSubmissionSpentVotes = async (contest_hash, sub_id, walletAddress) => {
    let spent = await db.query('select votes_spent from contest_votes where contest_hash = $1 and submission_id = $2 and voter = $3', [contest_hash, sub_id, walletAddress])
        .then(clean)
        .then(data => {
            if (!data) return 0
            return data.votes_spent
        })
    return spent
}

const getTotalSpentVotes = async (contest_hash, walletAddress) => {
    let spent = await db.query('select coalesce(sum(votes_spent),0) as total from contest_votes where contest_hash = $1 and voter = $2', [contest_hash, walletAddress])
        .then(clean)
    return spent.total
}

const getTotalVotingPower = async (strategy, walletAddress) => {
    if (strategy.strategy_type === 'arcade') {
        return strategy.hard_cap
    }
    else if (strategy.strategy_type === 'token') {
        let user_tokens = await checkWalletTokenBalance(walletAddress, strategy.address, strategy.decimal)
        return strategy.hard_cap ? Math.min(user_tokens, strategy.hard_cap) : user_tokens
    }
}

// calculate vp for a single submission
async function calculateSubmissionVotingPower(req, res, next) {
    const { ens, sub_id, walletAddress, contest_hash } = req.body;

    // if no restrictions or at least one of the restriction results are true, set the vp stats

    let x = req.restrictions_with_results.findIndex(e => e.user_result === true);

    if ((req.restrictions_with_results.length === 0) || (req.restrictions_with_results.findIndex(e => e.user_result === true) > -1)) {
        let [total_contest_spent, sub_spent, total_contest_vp] = await Promise.all([
            getTotalSpentVotes(contest_hash, walletAddress),
            getSubmissionSpentVotes(contest_hash, sub_id, walletAddress),
            getTotalVotingPower(req.strategy, walletAddress)
        ])

        let total_votes_available = total_contest_vp - (total_contest_spent - sub_spent)
        let submission_votes_available = Math.min(total_votes_available, req.strategy.sub_cap || total_votes_available)

        req.sub_total_vp = submission_votes_available;
        req.sub_votes_spent = sub_spent;
        req.sub_remaining_vp = submission_votes_available - sub_spent;
        next();

    }

    else {
        req.sub_total_vp = 0;
        req.sub_votes_spent = 0;
        req.sub_remaining_vp = 0;
        next();
    }

}

module.exports = {
    checkVoterRestrictions,
    verifyVotingPower,


    checkVoterEligibility,
    getContestVotingStrategy,
    calculateSubmissionVotingPower,
};