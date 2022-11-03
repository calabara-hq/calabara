const cron = require('node-cron')
const db = require('../../helpers/db-init.js')
const { EVERY_30_SECONDS, EVERY_10_SECONDS } = require('./schedule')
const fs = require('fs');
const path = require('path');
const crypto = require('crypto')
const { TwitterV2IncludesHelper } = require('twitter-api-v2')
const { clean, asArray } = require('../../helpers/common.js');
const { get_thread, get_tweet } = require('../../twitter-client/helpers.js');
const { checkWalletTokenBalance } = require('../../web3/web3.js');
const fetch = require('node-fetch');
const socketSendNewSubmission = require('../../helpers/socket-messages.js');

const serverBasePath = path.normalize(path.join(__dirname, '../../'))



const groupBy = (items, key) => items.reduce(
    (result, item) => ({
        ...result,
        [item[key]]: [
            ...(result[item[key]] || []),
            item,
        ],
    }),
    {},
);

const randomId = (length) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}



// select unregistered tweets. group by author id

const pull_unregistered_tweets = async () => {
    let now = new Date().toISOString();
    return await db.query('with upd as (update tweets set locked = true from \
                    (select tweets.id from tweets inner join contests on tweets.contest_hash = contests._hash \
                    where registered = false and contests._start < $1 and contests._voting > $1) as subquery\
                    returning tweets.author_id, tweets.tweet_id, tweets.contest_hash, tweets.created) \
                    select author_id, json_agg(json_build_object(\'tweet_id\', tweet_id, \'created\', created, \'contest_hash\', contest_hash)) as contests from upd group by author_id', [now])
        .then(clean)
        .then(asArray)
}

const lookup_twitter_user = async (twitter_user_id) => {
    return await db.query('select address from users where twitter->>\'id\' = $1', [twitter_user_id])
        .then(clean)
        .then(asArray)
        // it's possible for there to be multiple addresses linked to the same twitter account
        .then(data => data.length > 0 ? data : null)
}


const pull_contest = async (contest_hash) => {
    return await db.query('select ens, settings->\'submitter_restrictions\' as restrictions, settings->\'snapshot_block\' as snapshot_block, _hash, settings->\'twitter_integration\' as twitter_integration from contests where _hash = $1', [contest_hash])
        .then(clean)
}


// users can have multiple addresses linked to the same account. 
// we'll loop over addresses and determine if they have already submitted or not
const has_already_submitted = async (tweet, user_addresses) => {
    for (const address_el of user_addresses) {
        let submission = await db.query('select id from contest_submissions where contest_hash=$1 and author=$2', [tweet.contest_hash, address_el.address])
            .then(clean)
        if (submission) return true
    }
    return false
}

// users can have multiple addresses linked to the same account. 
// we'll loop over addresses and determine if any are eligible for the contest
// if one of them is eligible, return the address
const compute_restrictions = async (contest_data, user_addresses) => {

    for (const address_el of user_addresses) {
        if (contest_data.restrictions.length === 0) return address_el.address
        for (const restriction of contest_data.restrictions) {
            if (restriction.type === 'erc20' || restriction.type === 'erc721') {
                let result = await checkWalletTokenBalance(address_el.address, restriction.address, restriction.decimal, contest_data.snapshot_block)
                if (result >= restriction.threshold) return address_el.address
            }
        }
    }

    return false // if we made it this far, address does not qualify to submit
}


// pull media
// set url in block
// return block
const write_media = async (media) => {
    let url
    if (!media) return null
    if (media.type === 'video') return null
    if (media.type === 'photo') url = media.url
    if (media.type === 'animated_gif') url = media.preview_image_url

    let now = new Date().toISOString()
    const media_url = path.normalize(path.join('/contest-assets/staging/media', '_' + now + '_' + path.extname(url)))
    const destination = path.normalize(path.join(serverBasePath, media_url))

    // download the media
    const res = await fetch(url)
    const fileStream = fs.createWriteStream(destination);
    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve);
    });

    return media_url
}
const parse_tldr = async (head) => {
    const includes = new TwitterV2IncludesHelper(head)
    const media = includes.media
    let { id, text } = head.data
    let leftover_media = null
    let tldr_obj = {
        tldr_text: null,
        tldr_image: null
    }
    let parsed_text = text.replace(/(?:https?):\/\/[\n\S]+/g, '').trim(); // strip any links and trim whitespace
    if (text) {
        tldr_obj.tldr_text = parsed_text === "" ? null : parsed_text
    }
    if (media.length > 0) {
        const media_url = await write_media(media[0])
        tldr_obj.tldr_image = media_url
        if (media.length > 1) leftover_media = media.slice(1)
    }
    return { tldr_obj: tldr_obj, leftover_media: leftover_media }

}

const create_text_block = (text) => {
    let parsed_text = text.replace(/(?:https?):\/\/[\n\S]+/g, ''); // strip any links
    return {
        id: randomId(10),
        type: "paragraph",
        data: {
            text: parsed_text
        }
    }
}

const create_media_block = async (media) => {
    const media_url = await write_media(media)
    if (!media_url) return null
    return {
        id: randomId(10),
        type: "image",
        data: {
            file: {
                url: media_url
            },
            caption: "",
            withBorder: false,
            stretched: false,
            withBackground: false
        }
    }
}


// get the full tweet thread
// parse and convert media 
const create_submission = async (tweet, author_id) => {

    let submission_obj = {}
    let submission_body_obj = {
        time: Date.now(),
        blocks: [],
        version: "2.25.0"
    }

    const head_tweet = await get_tweet(tweet.tweet_id)  // get first tweet
    let tldr_result = await parse_tldr(head_tweet)      // parse the tldr
    submission_obj = tldr_result.tldr_obj               // set the tldr portion
    if (tldr_result.leftover_media) {                   // if there is leftover media, add it in the next few submission blocks
        for (const media of leftover_media) {
            let media_block = await create_media_block(media)
            if (media_block) submission_body_obj.blocks.push(media_block)
        }
    }
    const thread = await get_thread(tweet.tweet_id, author_id) // get the thread
    const includes = new TwitterV2IncludesHelper(thread)
    if (thread.meta.result_count > 0) {
        let thread_arr = thread.data.data.reverse()            // get it in chronological order
        for (const thread_el of thread_arr) {
            const medias = includes.medias(thread_el)
            const { id, text } = thread_el
            if (text) {
                let text_block = create_text_block(text)
                if (text_block) submission_body_obj.blocks.push(text_block)
            }
            for (const media of medias) {
                let media_block = await create_media_block(media)
                if (media_block) submission_body_obj.blocks.push(media_block)
            }
        }
    }

    submission_obj.submission_body = submission_body_obj
    return submission_obj

}



const write_submission = async (submission, contest_data, address, tweet_id) => {
    console.log('WRITING')
    let created = new Date().toISOString();
    submission.created = created;
    let submission_hash = crypto.createHash('md5').update(JSON.stringify(submission)).digest('hex').slice(-8);
    let destination_folder = `contest-assets/staging/submissions/${submission_hash}`
    let submission_url = `${destination_folder}.json`

    await new Promise((resolve, reject) => {
        const writestream = fs.createWriteStream(path.normalize(path.join(serverBasePath, submission_url)))
        writestream.write(JSON.stringify(submission), async err => {
            if (err) reject(err)
            resolve('done')
        })
    });


    let url = '/' + submission_url
    return await db.query('insert into contest_submissions (ens, contest_hash, author, created, locked, pinned, _url, meta_data) values ($1, $2, $3, $4, $5, $6, $7, $8) returning id ', [contest_data.ens, contest_data._hash, address, created, false, false, url, { tweet_id: tweet_id }])
        .then(clean)
        .then(result => {
            socketSendNewSubmission(contest_data._hash, contest_data.ens, { id: result.id, _url: url, author: address, votes: 0 })
        })
        .catch(err => console.log(err))


}

// unlock and mark all tweets from this user for this contest as registered
const unlock_and_register = async (author_id, contest_hash) => {
    try {
        return await db.query('update tweets set registered = true, locked = false where author_id = $1 and contest_hash = $2', [author_id, contest_hash])
    } catch (err) { console.log(err) }
}


// grab unregistered tweets
// group by author id
// search our db for known users

// for each user, find their latest tweet for each unique contest hash
// check if they qualify
// ignore qt's from admin account


const main_loop = async () => {
    const start = performance.now()
    const users = await pull_unregistered_tweets();
    if (!users) return
    setTimeout(() => {
        (async () => {
            for (const user_tweets_obj of users) {
                // lookup the twitter user in DB
                let user_addresses = await lookup_twitter_user(user_tweets_obj.author_id)
                // return if twitter user not registered in DB
                if (!user_addresses) continue
                // group user tweets by hash
                let grouped_by_hash = groupBy(user_tweets_obj.contests, 'contest_hash')
                console.log(grouped_by_hash)
                // for each user tweet from a particular contest
                for (const hash of Object.values(grouped_by_hash)) {
                    // get the most recent tweet
                    let latest_tweet = hash.reduce((a, b) => {
                        return new Date(a.created) > new Date(b.created) ? a : b;
                    });
                    let contest_data = await pull_contest(latest_tweet.contest_hash)
                    let has_submitted = await has_already_submitted(latest_tweet, user_addresses)
                    if (has_submitted) continue
                    let is_eligible_address = await compute_restrictions(contest_data, user_addresses)
                    if (!is_eligible_address) continue
                    //let is_eligible_address = "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C"
                    let submission = await create_submission(latest_tweet, user_tweets_obj.author_id)
                    await write_submission(submission, contest_data, is_eligible_address, latest_tweet.tweet_id)
                    console.log('AFTER WRITE')
                    // unlock and mark has registered in db. 
                    await unlock_and_register(user_tweets_obj.author_id, latest_tweet.contest_hash)
                    console.log(`took ${(performance.now() - start)} milliseconds`)
                }
            }
        })()
    }, 0)
}

const blocking_loop = () => {
    console.log('started counting')
    let counter = 0;
    for (let i = 0; i < 20_000_000_000; i++) {
        counter++;
    }
    console.log('finished counting')
}


const create_serialization_error = async () => {
    console.log('trying to create error')
    try {
        await db.query('begin isolation level repeatable read; \
        update tweets set created = \'1\' where id = 89; \
        begin isolation level repeatable read; \
        update tweets set created = \'1\' where id = 89; \
        commit')
    } catch (err) { console.log(err) }
}



const register_tweets = () => {
    cron.schedule(EVERY_30_SECONDS, () => {
        console.log('attempting to register tweets')
        //blocking_loop();
        main_loop();
        //create_serialization_error();
    })
}


module.exports = { pull_unregistered_tweets, main_loop, register_tweets, parse_tldr, create_submission }


// upgrade ->> allow users to update submissions by quote tweeting again
// if a user has connected multiple accounts, we need to pick one to use for their submission
// given a user address array, return 1 address that qualifies for the contest
// 1 submission per twitter ID
// if they have already submitted, use the same address to overwrite or keep existing sub.
// if they haven't submitted, the one that passes all requirements
// if more than one pass requirements and they haven't submitted before, use the most recently updated (length - 1)
/*
const calculate_update_data = async (tweet, user_addresses) => {
    let submission_address;
    if (user_addresses.length === 1) {
        submission_address = user_addresses[0].address
        let prev_submission = await db.query('select * from contest_submissions where contest_hash = $1 and author = $2', [tweet.contest_hash, submission_address])
            .then(clean)
        if (!prev_submission) {
            // user hasnt submitted. check requirements and post if successful
        }
        else {
            // user has submitted. check if this tweet is more recent than prev submission.
            // if it's a match, do nothing
            if (tweet.tweet_id === prev_submission.meta_data.tweet_id) return
            // otherwise, we have to update their submission
            // check requirements and post if successful
            console.log('WE SHOULD UPDATE')
        }
    }
    
        else if (user_addresses.length > 1) {
            console.log('GREATER THAN 1')
            for (const address_el of user_addresses) {
                console.log('running with address ', address_el)
                let submission = await db.query('select * from contest_submissions where contest_hash = $1 and author = $2', [tweet.contest_hash, address_el.address])
                    .then(clean)
                console.log(submission)
            }
        }
    
}
*/


