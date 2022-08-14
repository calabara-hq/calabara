const cron = require('node-cron');
const { clean, asArray } = require('../../helpers/common.js');
const db = require('../../helpers/db-init.js');
const { EVERY_10_SECONDS } = require('./schedule');
const fs = require('fs');
const fs_path = require('path');
const { parser } = require('stream-json/Parser');
const { streamValues } = require('stream-json/streamers/StreamValues');
const { chain } = require('stream-chain');
const Stringer = require('stream-json/jsonl/Stringer');
const { pinFromFs, pinFileStream } = require('../../helpers/ipfs-api.js');


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


// parse the submission body assets

let stream_url_flag = false;
const parseAssets = async (chunk) => {
    if (!stream_url_flag) {
        if (chunk.name === 'keyValue') {
            if (chunk.value === 'url') {
                stream_url_flag = true;
            }
        }
    }

    if (stream_url_flag && chunk.name === 'stringValue') {
        console.log('pinning submission asset');
        let hash = await pinFromFs(chunk.value)
        chunk.value = hash
        stream_url_flag = false;
    }

    return chunk
}

// parse the submission body

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
        console.log('pinning TLDR image')
        let hash = await pinFromFs(chunk.value)
        chunk.value = hash
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
        submission_body_flag = false;

        const test_out = fs.createWriteStream(fs_path.normalize(fs_path.join(serverBasePath, 'inner_out.json')))
        const asset_datasource = fs.createReadStream(fs_path.normalize(fs_path.join(serverBasePath, chunk.value)))

        const inner_pipeline = chain([
            parser(),
            async inner_chunk => await parseAssets(inner_chunk),
            streamValues(),
            chunk => chunk.value,
            new Stringer(),
            async chunk => await pinFileStream(chunk, 'submission_body')


        ])

        asset_datasource.pipe(inner_pipeline)

        let data = new Promise((resolve, reject) => {
            inner_pipeline.on('data', data => {
                resolve(data)
            })
        })


        let end = new Promise((resolve, reject) => {
            inner_pipeline.on('end', () => {
                resolve('finish pinning submission body')
            })
        })


        const asset_url = await data;
        const stream_end = await end;
        console.log(stream_end)
        chunk.value = asset_url
        return chunk


    }
    else {
        return chunk
    }

}



const mainLoop = async (unpinned_files) => {
    for (unpinned_body of unpinned_files) {
        try {
            let outsource = fs.createWriteStream(fs_path.normalize(fs_path.join(serverBasePath, 'final.json')))
            let datasource = fs.createReadStream(fs_path.normalize(fs_path.join(serverBasePath, unpinned_body._url)));
            const unpinned_body_pipeline = chain([
                parser(),
                async chunk => await parseSubmission(chunk),
                streamValues(),
                chunk => chunk.value,
                new Stringer(),
                async chunk => await pinFileStream(chunk, 'submission_meta')

            ]);

            datasource.pipe(unpinned_body_pipeline)//.pipe(outsource)


            let data = new Promise((resolve, reject) => {
                unpinned_body_pipeline.on('data', data => {
                    resolve(data)
                })
            })


            let end = new Promise((resolve, reject) => {
                unpinned_body_pipeline.on('end', () => {
                    resolve('finish pinning submission body')
                })
            })


            const asset_url = await data;
            const stream_end = await end;
            console.log('FINAL ASSET URL --> ', asset_url)

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