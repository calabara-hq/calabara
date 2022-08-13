const path = require('path')
const crypto = require('crypto')
const serverRoot = path.normalize(path.join(__dirname, '../'));
const asyncfs = require('fs').promises;
const fs = require('fs');
const { pinFromFs, pinJSON } = require('../helpers/ipfs-api');
// generate a contest identifier hash

// create folder with hash and writestream and write file to disk

// pass hash and timestamp to endpoint



async function createContest(req, res, next) {

    const { ens, contest_settings } = req.body;
    contest_settings.created = new Date().toISOString();
    let hash = crypto.createHash('md5').update(JSON.stringify(contest_settings)).digest('hex').slice(-8);
    contest_settings.hash = hash;
    let destination = `creator-contests/${ens}/${hash}/`

    // add the img folder while we're at it
    await asyncfs.mkdir(`${destination}/img`, { recursive: true }, (err) => {
        if (err) return res.sendStatus(401)

    })

    let writestream = fs.createWriteStream(path.join(serverRoot, `${destination}/settings.json`));
    writestream.write(JSON.stringify(contest_settings), (err) => {
        if (err) return res.sendStatus(401)
        req.hash = hash;
        req.created = contest_settings.created;
        next();
    })
}

async function createSubmission(req, res, next) {

    const { ens, submission_tldr, submission_body, contest_hash } = req.body;
    console.time('main')


    /*
    // use 'created' rather than 'time' for some uniformity
    delete submission.time;
    submission.created = new Date().toISOString();

    let submission_hash = crypto.createHash('md5').update(JSON.stringify(submission)).digest('hex').slice(-8);
    submission.hash = submission_hash;

    let destination = `creator-contests/${ens}/${contest_hash}/submissions/${submission_hash}`

    await asyncfs.mkdir(destination, { recursive: true }, (err) => {
        if (err) return res.sendStatus(401)

    })

    let writestream = fs.createWriteStream(path.join(serverRoot, `${destination}/${submission_hash}.json`));
    writestream.write(JSON.stringify(submission), (err) => {
        if (err) return res.sendStatus(401)
        req.contest_hash = contest_hash;
        req.submission_hash = submission_hash;
        req.created = submission.created;
        next();
    })
    */


    /****
     *  loop through image blocks
     *  for each image:
     *      pin to ipfs
     *      set the url in submission
     *      delete from filesystem
     ****/

    let ipfs_gateway = 'https://gateway.pinata.cloud/ipfs/'

    console.log(submission_body)
    console.log(submission_tldr)

    let index = 0
    console.time('primary pin loop')
    for (block of submission_body.blocks) {
        if (block.type === 'image') {
            // pin to ipfs and set the new url hash
            let job_id = index
            let og_url = block.data.file.url
            console.log('job number', job_id)
            /*
            console.log('beginning pin')
            let pin_res = await pinFromFs(og_url);
            console.log('finish pin')
            block.data.file.url = ipfs_gateway + pin_res.IpfsHash;

            */
            // delete the files from staging dir
            console.log('unlink file with job id', job_id)
            fs.unlink(path.normalize(path.join(__dirname, '../', og_url)), (err) => {
                if (err) console.log(err)
                console.log('finish unlink with job id', job_id)
            })
            console.log('outside unlink job id', job_id)
        }
        index++;
    }
    console.timeEnd('primary pin loop')

    // hash tldr image
    // pin body
    // put body hash in tldr data
    // hash tldr section
    // pass tldr hash to route

    console.time('secondary pinning')
    if (submission_tldr.tldr_image) {
        let tldr_img_hash = await pinFromFs(submission_tldr.tldr_image);
        fs.unlink(path.normalize(path.join(__dirname, '../', submission_tldr.tldr_image)), (err) => {
            if (err) console.log(err)
            submission_tldr.tldr_image = ipfs_gateway + tldr_img_hash.IpfsHash;

        })
    }

    let body_hash = await pinJSON(submission_body);
    console.log(body_hash)

    submission_tldr.submission_body = ipfs_gateway + body_hash.IpfsHash;

    let submission_hash = await pinJSON(submission_tldr);
    console.log(submission_hash)

    req.submission_url = ipfs_gateway + submission_hash.IpfsHash;
    req.contest_hash = contest_hash;
    req.created = new Date().toISOString();
    console.timeEnd('secondary pinning')

    console.timeEnd('main')
    next();
}


async function createSubmission2(req, res, next) {
    const { ens, submission, contest_hash } = req.body;

    submission.created = new Date().toISOString();

    let submission_hash = crypto.createHash('md5').update(JSON.stringify(submission)).digest('hex').slice(-8);

    console.time('start')

    let destination_folder = `contest-assets/staging/submissions/${submission_hash}`
    let submission_body_url = `${destination_folder}.body.json`
    let submission_meta_url = `${destination_folder}.meta.json`
    /* first, write submission body to fs, and replace submission_body with submission_body url
    * then, write submission to fs and pass along the url of the submission
    * we want something that looks like this
    * {
    *   tldr_text: xyz,
    *   tldr_image: fs url of image,
    *   submission_body: fs url of submission body
    * }
    */

    let body_writestream = fs.createWriteStream(path.join(serverRoot, submission_body_url));
    let meta_writestream = fs.createWriteStream(path.join(serverRoot, submission_meta_url));

    body_writestream.write(JSON.stringify(submission.submission_body), (err) => {
        if (err) console.log(err, 'submission_body write failure') //return res.sendStatus(401)
        submission.submission_body = '/' + submission_body_url;
        meta_writestream.write(JSON.stringify(submission), (err) => {
            if (err) console.log(err, 'submission_body write failure') //return res.sendStatus(401)
            req.contest_hash = contest_hash;
            req.url = '/' + submission_meta_url;
            req.created = submission.created;
            console.timeEnd('start')
            next();
        })
    })
}



module.exports = { createContest, createSubmission2 };