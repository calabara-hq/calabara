const cron = require('node-cron')
const db = require('../../helpers/db-init.js')
const { EVERY_5_MINUTES, EVERY_10_SECONDS, EVERY_30_SECONDS } = require('./schedule')
const { clean, asArray, parallelLoop } = require('../../helpers/common.js');
const { fetch_quote_tweets, register_tweet } = require('../../twitter-client/helpers.js');
const { TwitterV2IncludesHelper } = require('twitter-api-v2');


// get twitter contests that are in the submit window -- done
// get the announcment tweet ID -- done
// look for unregistered quote tweets
// try to match them with users in our DB

// add 5 minutes since this loop only runs every 5 mins
const getDate = () => {
    const now = new Date()
    return new Date(now.getTime() + 5 * 60000).toISOString()
}

const pull_active_twitter_contests = async () => {
    const date = getDate()
    return await db.query('select ens, _hash, settings->\'twitter_integration\' as twitter_integration from contests where _start < $1 and _voting > $1', [date])
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

const main_loop = async () => {
    const contests = await pull_active_twitter_contests()
    await parallelLoop(contests, async (contest) => {
        let quotes = await fetch_quote_tweets(contest.tweet_id)
        if (!quotes) return
        for (const quote of quotes) {
            await register_tweet(contest, quote)
        }
    })
}
// run this every 5 minutes
const pull_tweets = () => {
    cron.schedule(EVERY_30_SECONDS, () => {
        console.log('pulling contest tweets')
        main_loop()
    })
}


module.exports = { pull_tweets, pull_active_twitter_contests, main_loop }