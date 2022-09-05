const path = require('path')
const crypto = require('crypto')
const serverRoot = path.normalize(path.join(__dirname, '../../'));
const asyncfs = require('fs').promises;
const fs = require('fs');
const { pinFromFs, pinJSON } = require('../../helpers/ipfs-api');
const db = require('../../helpers/db-init.js');
const { clean, asArray } = require('../../helpers/common')
const { checkWalletTokenBalance } = require('../../web3/web3')


// return restrictions and voting_strategy
const pre_process = async (ens, contest_hash, sub_id) => {
    console.log(ens, contest_hash)
    let query1 = 'select settings->>\'voter_restrictions\' as restrictions,\
                    settings->> \'self_voting\' as self_voting,\
                    settings->>\'voting_strategy\' as strategy,\
                    _voting, _end\
                    from contests where ens = $1 and _hash = $2'

    let query2 = 'select author from contest_submissions where id = $1 and contest_hash = $2'

    let [contest_meta, sub_author] = await Promise.all(
        [
            db.query(query1, [ens, contest_hash]).then(clean),
            db.query(query2, [sub_id, contest_hash]).then(clean)
        ]
    )

    console.log(contest_meta)
    console.log(sub_author)

    let curr_time = new Date().toISOString()

    return {
        restrictions: Object.values(JSON.parse(contest_meta.restrictions)),
        strategy: JSON.parse(contest_meta.strategy),
        is_voting_window: ((contest_meta._voting < curr_time) && (curr_time < contest_meta._end)),
        is_self_voting_error: sub_author.author && !JSON.parse(contest_meta.self_voting)
    }

}


// handle both protected and unprotected modes
// mode = {protected: ?bool?}
const compute_restrictions = async (mode, walletAddress, restrictions) => {

    // regardless of mode, return true if there are no restrictions
    if (restrictions.length === 0) return true

    for (const restriction of restrictions) {
        if (restriction.type === 'erc20' || restriction.type === 'erc721') {
            let result = await checkWalletTokenBalance(walletAddress, restriction.address, restriction.decimal)
            let did_user_pass = result > restriction.threshold

            // return straight away in protected mode. We don't care what the other results are
            if (mode.protected && did_user_pass) {
                return true
            }
            // keep accumulating results in unprotected mode
            else if (!mode.protected) {
                restriction.user_result = did_user_pass
            }

        }
    }
    // return the restrictions in unprotected mode
    if (!mode.protected) {
        return restrictions
    }

    // return false if we're in the protected mode and made it this far
    return false
}


// calculate vp for a single submission
async function calc_sub_vp__unprotected(req, res, next) {
    const { ens, sub_id, walletAddress, contest_hash } = req.body;

    const mode = { protected: false };

    let contest_params = await pre_process(ens, contest_hash, sub_id);

    let restriction_results = await compute_restrictions(mode, walletAddress, contest_params.restrictions);

    // initialize vp to 0
    req.sub_total_vp = 0;
    req.sub_votes_spent = 0;
    req.sub_remaining_vp = 0;
    req.restrictions_with_results = restriction_results;

    // if at least one of the requirements are met
    if ((restriction_results === true) || (restriction_results.findIndex(e => e.user_result === true) > -1)) {
        let [total_contest_spent, sub_spent, total_contest_vp] = await Promise.all([
            getTotalSpentVotes(contest_hash, walletAddress),
            getSubmissionSpentVotes(contest_hash, sub_id, walletAddress),
            getTotalVotingPower(contest_params.strategy, walletAddress)
        ])


        let total_votes_available = total_contest_vp - (total_contest_spent - sub_spent);
        let submission_votes_available = Math.min(total_votes_available, contest_params.strategy.sub_cap || total_votes_available);

        req.sub_total_vp = submission_votes_available;
        req.sub_votes_spent = sub_spent;
        req.sub_remaining_vp = submission_votes_available - sub_spent;
        req.is_self_voting_error = contest_params.is_self_voting_error;
    }


    next();

}


async function calc_sub_vp__PROTECTED(req, res, next) {
    const { ens, sub_id, contest_hash, num_votes } = req.body;
    const walletAddress = req.user.address;
    const mode = { protected: true };

    let contest_params = await pre_process(ens, contest_hash, sub_id);

    if (contest_params.is_self_voting_error) return res.sendStatus(435);
    if (!contest_params.is_voting_window) return res.sendStatus(433);

    let restriction_results = await compute_restrictions(mode, walletAddress, contest_params.restrictions);

    if (!restriction_results) return res.sendStatus(434)

    let [total_contest_spent, sub_spent, total_contest_vp] = await Promise.all([
        getTotalSpentVotes(contest_hash, walletAddress),
        getSubmissionSpentVotes(contest_hash, sub_id, walletAddress),
        getTotalVotingPower(contest_params.strategy, walletAddress)
    ])


    let total_votes_available = total_contest_vp - (total_contest_spent - sub_spent)
    let submission_votes_available = Math.min(total_votes_available, contest_params.strategy.sub_cap || total_votes_available)

    if (num_votes > submission_votes_available) return res.sendStatus(436)

    console.log(submission_votes_available)

    req.sub_total_vp = submission_votes_available;
    req.sub_votes_spent = sub_spent;
    req.sub_remaining_vp = submission_votes_available - sub_spent;

    next();
}


/// helpers 

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



module.exports = {
    calc_sub_vp__unprotected,
    calc_sub_vp__PROTECTED
};