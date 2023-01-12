const cron = require('node-cron')
const fs = require('fs');
const path = require('path');
const { parallelLoop } = require('../../helpers/common.js');
const logger = require('../../logger.js').child({ service: 'cron:contest_garbage_collection' })

// grab file list from cron table and lock it

// delete files from fs

// delete job from db

const mediaBasePath = path.normalize(path.join(__dirname, '../../contest-assets/staging/media'))

const stale_threshold = 1440 // files older than this var (minutes) will be deleted in garbage collection




const checkStale = (curr_time, file_time_str) => {
    let file_time = new Date(file_time_str)
    let diff = curr_time - file_time;
    if (diff > 60e3) {
        let minutes_elapsed = Math.floor(diff / 60e3)
        if (minutes_elapsed > stale_threshold) return true
        return false
    }
    return false
}




const image_garbage_collection = async () => {
    let current_time = new Date()
    fs.readdir(mediaBasePath, async (err, images) => {
        if (err) return console.log(err);
        if (images.length === 0) return logger.log({ level: 'info', message: 'no stale images found' })
        logger.log({ level: 'info', message: `found ${images.length} potentially stale images` })
        await parallelLoop(images, async (image) => {
            let image_time = image.split('_')[1];
            if (checkStale(current_time, image_time)) {
                // image is stale. delete it
                fs.unlink(path.normalize(path.join(mediaBasePath, image)), (err) => {
                    if (err) return console.log(err)
                    return logger.log({ level: 'info', message: `delete stale image with name ${image}` })
                })
            }
        })
    })
}



const garbage_collection = (frequency) => {
    cron.schedule(frequency, () => {
        logger.log({ level: 'info', message: 'running contest garbage collection' })
        image_garbage_collection();
    })
}

module.exports = garbage_collection