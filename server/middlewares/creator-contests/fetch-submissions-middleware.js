const db = require("../../helpers/db-init");
const { clean, asArray, shuffleArray } = require('../../helpers/common')

/**
 * decide how to return submissions based on implemented contest settings
 * 
 */


/*anon_subs, self_voting, visible_votes,*/

const pre_process = async (ens, contest_hash) => {
    let params = await db.query('select \
    settings->\'visible_votes\' as visible_votes,\
    settings->\'anon_subs\' as anon_subs,\
    _start, _voting, _end from contests where ens=$1 and _hash = $2', [ens, contest_hash]).then(clean)
    return (params)
}



const construct_query = async (current_time, params, ens, contest_hash) => {
    const base_prefix = 'select contest_submissions.id, contest_submissions._url'
    const with_author = ',author'
    const with_votes = ',coalesce(sum(votes_spent), 0) as votes from contest_submissions left join contest_votes \
                      on contest_submissions.id = contest_votes.submission_id \
                      where contest_submissions.ens=$1 and contest_submissions.contest_hash=$2 \
                      group by contest_submissions.id'
    const without_votes = ' from contest_submissions where ens=$1 and contest_hash=$2'
    const sort_items = ' order by votes desc'

    // if the contest is over, return everything
    if (current_time > params._end) {
        return base_prefix + with_author + with_votes + sort_items
    }

    // contest not over. stitch together query
    return base_prefix + (params.anon_subs ? '' : with_author) + (params.visible_votes ? with_votes : without_votes)
}



async function fetchSubmissions(req, res, next) {
    const { ens, contest_hash } = req.query;
    const params = await pre_process(ens, contest_hash);
    const current_time = new Date().toISOString();
    const query = await construct_query(current_time, params, ens, contest_hash)
    let submissions = await db.query(query, [ens, contest_hash])
        .then(clean)
        .then(asArray)
        .then(data => {
            return current_time > params._end ? data : shuffleArray(data)
        })

    req.submissions = submissions
    next();
}

module.exports = { fetchSubmissions }