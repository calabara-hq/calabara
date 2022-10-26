const contest_garbage_collection = require('./contest-garbage-collection')
const pin_staging_files = require('./ipfs-pin-submission')
const pin_prompt_assets = require('./ipfs-pin-prompt-images');
const { pull_tweets } = require('./pull-tweets');
const init = () => {
    //contest_garbage_collection();
    //pin_staging_files();
    //pin_prompt_assets();
    pull_tweets();
}

module.exports = init;