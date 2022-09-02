const cron = require('node-cron')
const db = require('../../helpers/db-init.js')
const { EVERY_10_SECONDS } = require('./schedule')
const fs = require('fs');
const path = require('path')

// grab file list from cron table and lock it

// delete files from fs

// delete job from db

const mediaBasePath = path.normalize(path.join(__dirname, '../../contest-assets/staging/media'))
const submissionBasePath = path.normalize(path.join(__dirname, '../../contest-assets/staging/submissions'))

const stale_threshold = 1440 // files older than this var (minutes) will be deleted in garbage collection




const checkStale = (curr_time, file_time_str) => {
    let file_time = new Date(file_time_str)
    let diff = curr_time - file_time;
    if (diff > 60e3) {
        let minutes_elapsed = Math.floor(diff / 60e3)
        if(minutes_elapsed > stale_threshold) return true
        return false
    }
    return false
}

const image_garbage_collection = () => {
    let current_time = new Date()
    fs.readdir(mediaBasePath, (err, images) => {
        if (err) return console.log(err);
        if (images.length === 0) return console.log('no potentially stale images')
        console.log(`found ${images.length} potentially stale images`)
        images.forEach(image => {
            let image_time = image.split('_')[1];
            if(checkStale(current_time, image_time)){
                // image is stale. delete it
                fs.unlink(path.normalize(path.join(mediaBasePath, image)), (err) => {
                    if (err) return console.log(err)
                    return console.log(`delete stale image with name ${image}`)
                })
            }
        })
    })
}


const garbage_collection = () => {
    cron.schedule(EVERY_10_SECONDS, () => {
        console.log('running contest garbage collection')
        image_garbage_collection();
    })
}

module.exports = garbage_collection