const path = require('path')
const crypto = require('crypto')
const serverRoot = path.normalize(path.join(__dirname, '../'));
const asyncfs = require('fs').promises;
const fs = require('fs');
// generate a contest identifier hash

// create folder with hash and writestream and write file to disk

// pass hash and timestamp to endpoint



async function createContest(req, res, next) {
    const { ens, contest_settings } = req.body;
    contest_settings.created = new Date().toISOString();
    let hash = crypto.createHash('md5').update(JSON.stringify(contest_settings)).digest('hex').slice(-8);
    contest_settings.hash = hash;
    let destination = `creator-contests/${ens}/${hash}/`

    await asyncfs.mkdir(destination, { recursive: true }, (err) => {
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
    
    const { ens, submission, contest_hash } = req.body;

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

}



module.exports = { createContest, createSubmission };