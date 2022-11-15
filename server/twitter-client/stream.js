const { bearerClient } = require('./config')
const { ETwitterStreamEvent, TweetStream, TwitterApi, ETwitterApiError } = require('twitter-api-v2');
const { handle_fetched_tweet } = require('./helpers');
const logger = require('../logger').child({ service: 'twitter_stream_ingestor' })


let stream = null


const get_stream_rules = async () => {
    try {
        let rules = await bearerClient.v2.streamRules()
        let parsed_rules = rules.data ? rules.data : []
        return parsed_rules
    } catch (err) {
        logger.log({ level: 'error', message: `get twitter stream rules failed with error: ${err}` })
        throw (err)
    }
}

const delete_stream_rules = async (ids) => {
    try {
        await bearerClient.v2.updateStreamRules({
            delete: {
                ids: ids
            }
        })

        let rules = await get_stream_rules()
        if ((rules.length === 0) && (stream)) return close_stream()
    } catch (err) {
        logger.log({ level: 'error', message: `delete twitter stream rules failed with error: ${err}` })
    }
}

const add_stream_rules = async (arr) => {
    try {
        let rules = await get_stream_rules()
        if (rules.length === 5) return logger.log({ level: 'error', message: `twitter stream buffer is full` })
        logger.log({ level: 'error', message: `attempting to add stream rules: ${JSON.stringify(arr)}` })
        await bearerClient.v2.updateStreamRules({
            add: arr
        });
        if (!stream) return start_stream()
    } catch (err) {
        logger.log({ level: 'error', message: `add twitter stream rules failed with error: ${err}` })
    }
}


const start_stream = async () => {
    try {
        stream = await bearerClient.v2.searchStream({ expansions: "author_id", "tweet.fields": "created_at" });
        stream_listen();
    } catch (err) {
        logger.log({ level: 'error', message: `Start twitter stream failed with error: ${err}` })
    }
}


const close_stream = () => {
    try {
        stream.close()
        stream = null
    } catch (err) {
        logger.log({ level: 'error', message: `Close twitter stream failed with error: ${err}` })
    }
}


const stream_listen = () => {
    // Awaits for a tweet
    stream.on(
        // Emitted when Node.js {response} emits a 'error' event (contains its payload).
        ETwitterStreamEvent.ConnectionError,
        err => logger.log({ level: 'error', message: `Twitter stream failed with error: ${err}` }),
    );

    stream.on(
        // Emitted when Node.js {response} is closed by remote or using .close().
        ETwitterStreamEvent.ConnectionClosed,
        () => logger.log({ level: 'info', message: `Twitter stream has been closed` }),
    );

    stream.on(
        // Emitted when a Twitter payload (a tweet or not, given the endpoint).
        ETwitterStreamEvent.Data,
        eventData => handle_fetched_tweet(eventData),
    );

    stream.on(
        // Emitted when a Twitter sent a signal to maintain connection active
        ETwitterStreamEvent.DataKeepAlive,
        () => logger.log({ level: 'info', message: `Twitter has a keep-alive packet` }),
    );

    // Enable reconnect feature
    stream.autoReconnect = true;
}


get_stream_rules()
    .then(rules => {
        logger.log({ level: 'info', message: `initial stream rules: ${JSON.stringify(rules)}` })
        if ((rules.length > 0) && (!stream)) start_stream()
    })

module.exports = { add_stream_rules, delete_stream_rules, get_stream_rules }