const cron = require('node-cron')
const db = require('../../helpers/db-init.js')
const { clean, asArray, parallelLoop } = require('../../helpers/common.js');
const { fetch_quote_tweets, register_tweet } = require('../../twitter-client/helpers.js');
const logger = require('../../logger.js').child({ service: 'cron:pull_tweets' })


// get twitter contests that are in the submit window -- done
// get the announcment tweet ID -- done
// look for unregistered quote tweets
// try to match them with users in our DB

// insert 5 minutes buffer to voting end since this loop only runs every 5 mins
const getDates = () => {
    const now = new Date()
    return { t1: now.toISOString(), t2: new Date(now.getTime() - (5 * 60000)).toISOString() }

}

const pull_active_twitter_contests = async () => {
    const dates = getDates()
    return await db.query('select ens, _hash, settings->\'twitter_integration\' as twitter_integration from contests where _start < $1 and _voting > $2', [dates.t1, dates.t2])
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
        logger.log({ level: 'info', message: `processing ${quotes.length} tweets for contest ${contest.hash}` })
        for await (const quote of quotes) {
            console.log('from pull tweets')
            console.log(quote)
            await register_tweet(contest, quote)
        }
    })
}
// run this every 5 minutes
const pull_tweets = (frequency) => {
    cron.schedule(frequency, () => {
        logger.log({ level: 'info', message: 'pulling contest tweets' })
        main_loop()
    })
}


module.exports = { pull_tweets, pull_active_twitter_contests, main_loop }