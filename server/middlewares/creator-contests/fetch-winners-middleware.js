const path = require('path')
const crypto = require('crypto')
const serverRoot = path.normalize(path.join(__dirname, '../../'));
const asyncfs = require('fs').promises;
const fs = require('fs');
const db = require('../../helpers/db-init.js');
const { clean, asArray } = require('../../helpers/common')
const { checkWalletTokenBalance } = require('../../web3/web3')




// get submissions with authors and votes, in desc order, as well as the contest rewards configuration
const pre_process = async (ens, contest_hash) => {
    let subs_full_details = await db.query('select contest_submissions.id, _url, author, sum(votes_spent) as votes, json_agg((voter, votes_spent)) as voters from contest_submissions left join contest_votes on contest_submissions.id = contest_votes.submission_id where contest_submissions.ens=$1 and contest_submissions.contest_hash=$2 group by contest_submissions.id order by votes desc', [ens, contest_hash]).then(clean)

    let [submissions, rewards] = await Promise.all(
        [
            //db.query('select contest_submissions.id, _url, sum(votes_spent) as votes, json_agg((voter, votes_spent)) as voters, author from contest_submissions inner join contest_votes on contest_submissions.id = contest_votes.submission_id where contest_submissions.ens=$1 and contest_submissions.contest_hash=$2 group by contest_submissions.id order by votes desc', [ens, contest_hash]).then(clean),
            db.query('select contest_submissions.id, _url, author, sum(votes_spent) as votes, json_agg((voter, votes_spent)) as voters from contest_submissions left join contest_votes on contest_submissions.id = contest_votes.submission_id where contest_submissions.ens=$1 and contest_submissions.contest_hash=$2 group by contest_submissions.id order by votes desc', [ens, contest_hash]).then(clean).then(asArray),
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
    if (now < result._end) return res.sendStatus(438)
    next()

}

async function get_winners(req, res, next) {
    const { ens, contest_hash } = req.query
    let { submissions, rewards } = await pre_process(ens, contest_hash)

    let sub_winners = []
    let vote_winners = []
    let final_winners = []

    Object.values(rewards.sub_rewards).map((reward, index) => {
        let winner = submissions[reward.rank - 1]
        sub_winners.push({ rank: reward.rank, reward, winner })
        // rewards.eth ? final_winners.push()
    })

    // map over voter rewards
    // map over voters at the voter reward index
    // divide votes by reward
    // push object to vote_winners
    // console.log(sub_winners)

    req.sub_winners = sub_winners
    req.vote_winners = vote_winners
    next()

}

async function get_winners_as_csv(req, res, next) {
    const { ens, contest_hash } = req.query
    let { submissions, rewards } = await pre_process(ens, contest_hash)


    let sub_winners = []
    let vote_winners = []
    let final_winners = []
    let csvContent = "data:text/csv;charset=utf-8,token_type,token_address,receiver,amount,id\r\n";

    if (submissions.length > 0) {

        Object.values(rewards.sub_rewards).map((reward, index) => {
            let winner = submissions[reward.rank - 1]
            //sub_winners.push({ rank: reward.rank, reward, winner })
            reward.eth ? csvContent += `native,,${winner.author},${reward.eth.amount},,\r\n` : null
            reward.erc20 ? csvContent += `erc20,${reward.erc20.address},${winner.author}, ${reward.erc20.amount},,\r\n` : null
        })

        // map over voter rewards
        // map over voters at the voter reward index
        // divide votes by reward
        // push object to vote_winners
        // console.log(sub_winners)

        Object.values(rewards.voter_rewards).map((reward, index) => {
            let winner = submissions[reward.rank - 1]
            winner.voters.map(voter => {
                if (voter.f1 != null) {
                    reward.eth ? csvContent += `native,,${voter.f1},${reward.eth.amount * (voter.f2 / winner.votes)},,\r\n` : null
                    reward.erc20 ? csvContent += `erc20,${reward.erc20.address},${voter.f1}, ${reward.erc20.amount * (voter.f2 / winner.votes)},,\r\n` : null
                }
            })
        })
    }
    req.csvContent = csvContent
    next()

}


module.exports = { get_winners, get_winners_as_csv, verifyContestOver }