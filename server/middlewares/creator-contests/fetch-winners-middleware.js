const db = require('../../helpers/db-init.js');
const { clean, asArray } = require('../../helpers/common');
const logger = require('../../logger.js').child({ service: 'middleware:fetch_contest_winners' })




// get submissions with authors and votes, in desc order, as well as the contest rewards configuration
const pre_process = async (ens, contest_hash) => {

    let [submissions, rewards] = await Promise.all(
        [
            db.query('select contest_submissions.id, _url, author, coalesce(sum(votes_spent), 0) as votes, json_agg((voter, votes_spent)) as voters from contest_submissions left join contest_votes on contest_submissions.id = contest_votes.submission_id where contest_submissions.ens=$1 and contest_submissions.contest_hash=$2 group by contest_submissions.id order by votes desc', [ens, contest_hash]).then(clean).then(asArray),
            db.query('select settings->\'submitter_rewards\' as sub_rewards, settings->\'voter_rewards\' as voter_rewards from contests where ens=$1 and _hash=$2', [ens, contest_hash]).then(clean),
        ]
    )
    return { submissions, rewards }
}


async function verifyContestOver(req, res, next) {
    const { ens, contest_hash } = req.query

    let result = await db.query('select _end from contests where ens = $1 and _hash = $2', [ens, contest_hash])
        .then(clean)
    let now = new Date().toISOString();
    if (now < result._end) {
        logger.log({ level: 'error', message: 'attempted to fetch winners before contest was over' })
        return res.sendStatus(438)
    }
    next()

}



async function get_winners_as_csv(req, res, next) {
    const { ens, contest_hash } = req.query
    let { submissions, rewards } = await pre_process(ens, contest_hash)

    let csvContent = "data:text/csv;charset=utf-8,token_type,token_address,receiver,amount,id\r\n";

    try {
        if (submissions.length > 0) {
            console.log(submissions)
            rewards.sub_rewards.map((reward, index) => {
                console.log(reward.rank)
                let winner = submissions[reward.rank - 1]
                //sub_winners.push({ rank: reward.rank, reward, winner })
                if (winner) { // in case rewards.length > winners.length
                    reward.eth ? csvContent += `native,,${winner.author},${reward.eth.amount},\r\n` : null
                    reward.erc20 ? csvContent += `erc20,${reward.erc20.address},${winner.author}, ${reward.erc20.amount},\r\n` : null
                    reward.erc721 ? csvContent += `erc721,${reward.erc721.address},${winner.author},,${reward.erc721.token_id}\r\n` : null
                }
            })

            // map over voter rewards
            // map over voters at the voter reward index
            // divide votes by reward
            // push object to vote_winners
            // console.log(sub_winners)

            rewards.voter_rewards.map((reward, index) => {
                let winner = submissions[reward.rank - 1]
                if (winner) { // in case rewards.length > winners.length
                    winner.voters.map(voter => {
                        if (voter.f1 != null) {
                            reward.eth ? csvContent += `native,,${voter.f1},${reward.eth.amount * (voter.f2 / winner.votes)},\r\n` : null
                            reward.erc20 ? csvContent += `erc20,${reward.erc20.address},${voter.f1}, ${reward.erc20.amount * (voter.f2 / winner.votes)},\r\n` : null
                        }
                    })
                }
            })
        }
        req.csvContent = csvContent
        next()
    } catch (err) {
        logger.log({ level: 'error', message: `generating winners csv failed with error: ${err}` })
    }

}


module.exports = { get_winners_as_csv, verifyContestOver }