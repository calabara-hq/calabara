const cron = require('node-cron');
const { clean, asArray, serializedLoop, parallelLoop } = require('../../helpers/common.js');
const db = require('../../helpers/db-init.js');
const { EVERY_10_SECONDS, EVERY_30_SECONDS } = require('./schedule');
const fs = require('fs');
const fs_path = require('path');
const { parser } = require('stream-json/Parser');
const { streamValues } = require('stream-json/streamers/StreamValues');
const { chain } = require('stream-chain');
const Stringer = require('stream-json/jsonl/Stringer');
const { pinFromFs, pinFileStream } = require('../../helpers/ipfs-api.js');
const ndjson = require('ndjson');
const FormData = require('form-data')

// grab file list from cron table and lock rows

// read files from fs

// pin and format elements

// delete files from fs

// update locked, pinned, and _url fields in the db

const serverBasePath = fs_path.normalize(fs_path.join(__dirname, '../../'))


const getFileUrls = async () => {
    try {
        // CHANGE THIS BACK TO TRUE
        let result = await db.query('update contest_submissions set locked = true where pinned = false and locked = false returning id, _url').then(clean).then(asArray);
        return result
    } catch (e) { console.log(e) }
}

const updateFileUrl = async (id, new_url) => {
    try {
        let result = await db.query('update contest_submissions set locked = false, pinned = true, _url = $1 where id = $2', [new_url, id])
        return
    } catch (e) { console.log(e) }
}


const deleteFromFs = (url) => {
    fs.unlink(fs_path.normalize(fs_path.join(serverBasePath, url)), (err) => {
        if (err) return console.log(err)
        return console.log(`delete stale submission from fs`)
    })
}



const parseBody = async (chunk) => {

    for (block of chunk.submission_body.blocks) {
        if (block.type === 'image') {
            let hash = await pinFromFs(block.data.file.url)
            block.data.file.url = hash;
        }
    }
    return chunk
}



const parseSubmission = async (chunk) => {
    //const rows = string

    if (chunk.tldr_image) {
        let hash = await pinFromFs(chunk.tldr_image)
        chunk.tldr_image = hash
    }
    if (chunk.submission_body) {
        chunk = await parseBody(chunk);
    }
    return chunk

}

const mainLoop = async () => {

    let unpinned_files = await getFileUrls();
    await parallelLoop(unpinned_files, async (unpinned_body) => {
        try {
            const datasource = fs.createReadStream(fs_path.normalize(fs_path.join(serverBasePath, unpinned_body._url)))

            const pipeline = chain([
                parser(),
                streamValues(),
                chunk => chunk.value,
                async chunk => await parseSubmission(chunk),
                new Stringer(),
                async chunk => await pinFileStream(chunk, 'submission')

            ]);

            datasource.pipe(pipeline)

            let data = new Promise((resolve, reject) => {
                pipeline.on('data', data => {
                    resolve(data)
                })
            })


            let end = new Promise((resolve, reject) => {
                pipeline.on('end', () => {
                    resolve('finish pinning submission body')
                })
            })


            const asset_url = await data;
            const stream_end = await end;
            console.log(stream_end)
            console.log('FINAL ASSET URL --> ', asset_url);
            await Promise.all([
                updateFileUrl(unpinned_body.id, asset_url),
                deleteFromFs(unpinned_body._url)
            ])

        } catch (err) { console.log(err) }
    })
    return
}


const pin_staging_files = () => {
    cron.schedule(EVERY_10_SECONDS, async () => {
        console.log('pinning submissions')
        mainLoop();
    })
}


module.exports = pin_staging_files;