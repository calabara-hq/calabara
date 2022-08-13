const cron = require('node-cron')
const db = require('../../helpers/db-init.js')
const { EVERY_10_SECONDS } = require('./schedule')


// grab file list from cron table and lock it

// delete files from fs

// delete job from db

const garbage_collection = () => {
    cron.schedule(EVERY_10_SECONDS, () => {
        console.log('running every 10 seconds')
    })
}

module.exports = garbage_collection