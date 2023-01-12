const contest_garbage_collection = require('./contest-garbage-collection')
const pin_staging_files = require('./ipfs-pin-submission')
const pin_prompt_assets = require('./ipfs-pin-prompt-images');
const { pull_tweets } = require('./pull-tweets');
const { register_tweets } = require('./register-tweets');
const { manage_stream } = require('./manage-stream');
const { EVERY_10_SECONDS, EVERY_30_SECONDS, EVERY_5_MINUTES, EVERY_HOUR } = require('./schedule');

const init = () => {
    pin_staging_files(EVERY_30_SECONDS);
    pin_prompt_assets(EVERY_30_SECONDS);
    register_tweets(EVERY_30_SECONDS);
    manage_stream(EVERY_5_MINUTES);
    pull_tweets(EVERY_5_MINUTES);
    contest_garbage_collection(EVERY_HOUR);
}

module.exports = init;