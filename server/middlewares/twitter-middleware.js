const db = require('../helpers/db-init')
const { clean } = require('../helpers/common')
const { TwitterApi } = require('twitter-api-v2')


const pre_process = async (ens, contest_hash) => {
    let twitter_settings = await db.query('select settings ->\'twitter_integration\' as twitter_integration from contests where ens = $1 and _hash = $2', [ens, contest_hash])
        .then(clean)

    return twitter_settings.twitter_integration
}

// get announcement tweet ID





function verifyTwitterAuth(req, res, next) {
    if (!req.session.accessToken) return res.sendStatus()
}





async function sendTweet(req, res, next) {
    const { ens, contest_hash } = req.body

    next()
}


async function sendQuoteTweet(req, res, next) {
    const { ens, contest_hash, tweet } = req.body
    const twitter_settings = await pre_process(ens, contest_hash)
    if (!twitter_settings) return res.send('not a twitter contest').status(439)
    const { announcementID } = twitter_settings

    const { accessToken } = req.session.twitter;
    if (!accessToken) return res.sendStatus(440)

    console.log(accessToken)
    console.log(announcementID)
    console.log(tweet)

    tweet[0].quote_tweet_id = announcementID

    const client = new TwitterApi(accessToken);

    try {
        //const { data: createdTweet } = await client.v2.tweet(tweet)
        //const { data } = await client.v2.tweet({"text": tweet, quote_tweet_id: announcementID}) quote tweet
        const { data } = await client.v2.tweetThread(tweet)
        //console.log('Tweet', createdTweet.id, ':', createdTweet.text);
        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        if (err.status === 403) return res.sendStatus(403)
        return res.sendStatus(401)
    }



}

// send tweet




module.exports = { sendTweet, sendQuoteTweet }