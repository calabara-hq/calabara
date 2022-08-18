const contest_garbage_collection = require('./contest-garbage-collection')
const pin_staging_files = require('./ipfs-pin')

const init = () => {
    //contest_garbage_collection();
     pin_staging_files();
}

module.exports = init;