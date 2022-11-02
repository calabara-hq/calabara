const cron = require('node-cron')
const db = require('../../helpers/db-init.js')
const { EVERY_5_MINUTES } = require('./schedule')
const { clean, asArray } = require('../../helpers/common.js');
const { fetch_quote_tweets } = require('../../twitter-client/helpers.js');


// get twitter contests that are in the submit window -- done
// get the announcment tweet ID -- done
// look for unregistered quote tweets
// try to match them with users in our DB


const pull_active_twitter_contests = async () => {
    const now = new Date().toISOString()
    return await db.query('select ens, _hash, settings->\'twitter_integration\' as twitter_integration from contests where _start < $1 and _voting > $1', [now])
        .then(clean)
        .then(asArray)
        .then(data => {
            return data.filter(el => {
                return (
                    (el.twitter_integration !== null) && (typeof el.twitter_integration.announcementID === 'string'))
            }).map(el => {
                return {
                    ens: el.ens,
                    hash: el._hash,
                    tweet_id: el.twitter_integration.announcementID,
                }
            })
        })
}


const register_tweet = async (contest, quote) => {
    return await db.query('insert into tweets (tweet_id, author_id, created, contest_hash, locked, registered) values ($1, $2, $3, $4, $5, $6)', [quote.id, quote.author_id, quote.created_at, contest.hash, false, false])
        .catch(err => { return (err) })
}


const main_loop = async () => {
    const contests = await pull_active_twitter_contests()
    for (const contest of contests) {
        let quotes = await fetch_quote_tweets(contest.tweet_id)
        if (!quotes) return
        for (const quote of quotes) {
            await register_tweet(contest, quote)
        }
    }
}

// run this every 5 minutes
const pull_tweets = () => {
    cron.schedule(EVERY_5_MINUTES, () => {
        console.log('pulling contest tweets')
        loop()
    })
}


module.exports = { pull_tweets, pull_active_twitter_contests, main_loop }