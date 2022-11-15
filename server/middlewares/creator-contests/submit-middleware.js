const path = require('path')
const crypto = require('crypto')
const serverRoot = path.normalize(path.join(__dirname, '../../'));
const fs = require('fs');
const db = require('../../helpers/db-init.js');
const { clean, asArray } = require('../../helpers/common')
const { checkWalletTokenBalance } = require('../../web3/web3');
const logger = require('../../logger').child({ service: 'middleware:contest_submit' })



// return restrictions, submit_window, and whether this user already submitted or not
const pre_process = async (ens, walletAddress, contest_hash) => {
    const query1 = 'select settings->\'submitter_restrictions\' as restrictions, settings->\'snapshot_block\' as snapshot_block, settings->\'twitter_integration\' as twitter_integration ,_start, _voting from contests where ens = $1 and _hash = $2';
    const query2 = 'select id from contest_submissions where ens = $1 and contest_hash=$2 and author=$3'

    let [contest_meta, user_subs] = await Promise.all(
        [
            db.query(query1, [ens, contest_hash]).then(clean),
            db.query(query2, [ens, contest_hash, walletAddress]).then(clean).then(asArray)
        ]
    )

    let curr_time = new Date().toISOString();

    return {
        restrictions: contest_meta.restrictions,
        is_twitter: contest_meta.twitter_integration,
        is_submit_window: ((contest_meta._start < curr_time) && (curr_time < contest_meta._voting)),
        has_already_submitted: user_subs.length > 0,
        snapshot_block: contest_meta.snapshot_block
    }
}


const compute_restrictions = async (mode, walletAddress, restrictions, snapshot_block) => {
    // regardless of mode, return true if there are no restrictions
    if (restrictions.length === 0) return true

    for (const restriction of restrictions) {
        if (restriction.type === 'erc20' || restriction.type === 'erc721' || restriction.type === 'erc1155') {

            let result = await checkWalletTokenBalance(walletAddress, restriction.address, restriction.decimal, snapshot_block, restriction.token_id)

            let did_user_pass = result >= restriction.threshold;

            // return straight away in protected mode. We don't care what the other results are (logical or)
            if (mode.protected && did_user_pass) return true

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

// if twitter contest, check db for tweets that are not yet registered
const checkPendingSubmissions = async (walletAddress, contest_hash, is_twitter) => {
    if (!is_twitter) return false

    return await db.query('select tweets.id from users inner join tweets on users.twitter ->> \'id\' = tweets.author_id where tweets.registered = false and users.address = $1 and tweets.contest_hash = $2', [walletAddress, contest_hash])
        .then(clean)
        .then(data => data ? true : false)

}



// unprotected eligibility check.
async function check_submitter_eligibility_unprotected(req, res, next) {
    const { ens, walletAddress, contest_hash } = req.body;
    const mode = { protected: false };

    let contest_meta = await pre_process(ens, walletAddress, contest_hash);
    let restriction_results = await compute_restrictions(mode, walletAddress, contest_meta.restrictions, contest_meta.snapshot_block);
    // only check pending if user hasn't already submitted
    let isSubmissionPending = contest_meta.has_already_submitted ? false : await checkPendingSubmissions(walletAddress, contest_hash, contest_meta.is_twitter)

    req.is_pending = isSubmissionPending;
    req.restrictions_with_results = restriction_results;
    req.has_already_submitted = contest_meta.has_already_submitted;
    req.is_submit_window = contest_meta.is_submit_window;

    next();
}

// protected eligibility check (used in actual submitting). this function either continues or throws an error
async function check_submitter_eligibility_PROTECTED(req, res, next) {
    const { ens, contest_hash } = req.body;
    const walletAddress = req.session.user.address;

    const mode = { protected: true };

    let contest_meta = await pre_process(ens, walletAddress, contest_hash);
    let restriction_results = await compute_restrictions(mode, walletAddress, contest_meta.restrictions, contest_meta.snapshot_block);

    // if we failed the requirements check, return an error
    if (!restriction_results) {
        logger.log({ level: 'error', message: 'user failed restriction checks' })
        return res.sendStatus(419)
    }

    // if user already submitted, return an error
    if (contest_meta.has_already_submitted) {
        logger.log({ level: 'error', message: 'user has already submitted' })
        return res.sendStatus(420)
    }

    // if not in submission window, return an error
    if (!contest_meta.is_submit_window) {
        logger.log({ level: 'error', message: 'user attempted to submit outside of the submission window' })
        return res.sendStatus(432)
    }

    next();
}


async function createSubmission(req, res, next) {
    const { ens, submission, contest_hash } = req.body;

    // make sure we are in the submission window
    let created = new Date().toISOString();

    submission.created = created;

    let submission_hash = crypto.createHash('md5').update(JSON.stringify(submission)).digest('hex').slice(-8);

    let destination_folder = `contest-assets/staging/submissions/${submission_hash}`
    let submission_url = `${destination_folder}.json`

    const writestream = fs.createWriteStream(path.join(serverRoot, submission_url))
    writestream.write(JSON.stringify(submission), err => {
        if (err) logger.log({ level: 'error', message: `submission write failed with error: ${err}` })
        req.contest_hash = contest_hash;
        req.url = '/' + submission_url;
        req.created = created;
        next();
    })

}


module.exports = {
    check_submitter_eligibility_unprotected,
    check_submitter_eligibility_PROTECTED,
    createSubmission
};
