const cron = require('node-cron');
const { clean, asArray } = require('../../helpers/common.js');
const db = require('../../helpers/db-init.js');
const { EVERY_10_SECONDS } = require('./schedule');
const fs = require('fs');
const fs_path = require('path');
const { pick } = require('stream-json/filters/Pick');
const { parser } = require('stream-json/Parser');
const { streamValues } = require('stream-json/streamers/StreamValues');
const { streamArray } = require('stream-json/streamers/StreamArray');
const { filter } = require('stream-json/filters/Filter');
const { comp } = require('stream-chain/utils/comp');
const { chain } = require('stream-chain');


// grab file list from cron table and lock rows

// read files from fs

// pin and format elements

// delete files from fs

// update locked, pinned, and _url fields in the db

const serverBasePath = fs_path.normalize(fs_path.join(__dirname, '../../'))


const getFileUrls = async () => {
    try {
        // CHANGE THIS BACK TO TRUE
        let result = await db.query('update contest_submissions set locked = false where pinned = false and locked = false returning _url').then(clean).then(asArray);
        return result
    } catch (e) { console.log(e) }
}
/**
 * for url in list,
 *  read it
 *  read its submission body
 *  for image in submission body
 *      pin it
 *      update url in submission_body with the image ipfs hash
 *  pin the submission body
 *  update url in submission with the body ipfs hash
 *  pin the file
 *  update url / pinned / locked in db
 *      
 * 
 *  
 * */


// pin the submission body assets

let stream_url_flag = false;
const pinAssets = async (chunk) => {

    if (!stream_url_flag) {
        if (chunk.name === 'keyValue') {
            if (chunk.value === 'url') {
                stream_url_flag = true;
            }
        }
    }

    if (stream_url_flag && chunk.name === 'stringValue') {
        chunk.value = 'IT WORKS'
        stream_url_flag = false;
    }


    return chunk

}


let tldr_image_flag = false;
let submission_body_flag = false;
const parseSubmission = async (chunk) => {

    if (!tldr_image_flag) {
        if (chunk.name === 'keyValue') {
            if (chunk.value === 'tldr_image') {
                tldr_image_flag = true;
            }
        }
    }

    if (tldr_image_flag && chunk.name === 'stringValue') {
        chunk.value = 'IT WORKS'
        tldr_image_flag = false;
    }

    if (!submission_body_flag) {
        if (chunk.name === 'keyValue') {
            if (chunk.value === 'submission_body') {
                submission_body_flag = true;
            }
        }
    }

    if (submission_body_flag && chunk.name === 'stringValue') {
        chunk.value = 'IT WORKS'
        submission_body_flag = false;
    }


    return chunk
}

const mainLoop = async (unpinned_files) => {
    for (unpinned_body of unpinned_files) {
        console.time('start')
        try {

            const unpinned_body_pipeline = chain([
                fs.createReadStream(fs_path.normalize(fs_path.join(serverBasePath, unpinned_body._url))),
                parser(),
                async chunk => await parseSubmission(chunk),
                streamValues(),
            ]);

            unpinned_body_pipeline.on('data', chunk => {
                console.log(chunk)
                
                const inner_pipeline = chain([
                    fs.createReadStream(fs_path.normalize(fs_path.join(serverBasePath, chunk.value))),
                    parser(),
                    async chunk => await pinAssets(chunk),
                    streamValues(),
                ])
                inner_pipeline.on('data', (data) => {
                    console.log(data)
                })
                inner_pipeline.on('end', () => { console.timeEnd('start') })
                
            })
            unpinned_body_pipeline.on('end', () => { console.log(' OUTER END !!!') })
        } catch (err) { console.log(err) }
    }
    return
}


const pin_staging_files = () => {
    cron.schedule(EVERY_10_SECONDS, async () => {
        let unpinned_files = await getFileUrls();
        await mainLoop(unpinned_files);
    })
}


module.exports = pin_staging_files;