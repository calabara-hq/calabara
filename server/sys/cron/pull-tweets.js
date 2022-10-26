const cron = require('node-cron')
const db = require('../../helpers/db-init.js')
const { EVERY_10_SECONDS } = require('./schedule')
const fs = require('fs');
const path = require('path')


const loop = () => {
    return
}



const pull_tweets = () => {
    cron.schedule(EVERY_10_SECONDS, () => {
        console.log('pulling contest tweets')
        loop()
    })
}


module.exports.pull_tweets = pull_tweets