const path = require('path')
const crypto = require('crypto')
const serverRoot = path.normalize(path.join(__dirname, '../'));
const asyncfs = require('fs').promises;
const fs = require('fs');
const dotenv = require('dotenv')

dotenv.config();

// generate a contest identifier hash

// create folder with hash and writestream and write file to disk

// pass hash and timestamp to endpoint





async function createContest(req, res, next) {
    const { ens, contest_settings } = req.body;
    contest_settings.created = new Date().toISOString();
    contest_settings.sw_version = process.env.SW_VERSION;
    let hash = crypto.createHash('md5').update(JSON.stringify(contest_settings)).digest('hex').slice(-8);
    contest_settings.hash = hash;
    let destination = `creator-contests/${ens}/${hash}/`
    // add the img folder while we're at it

    /*
    await asyncfs.mkdir(`${destination}/img`, { recursive: true }, (err) => {
        if (err) return res.sendStatus(401)
        req.hash = hash;
        req.created = contest_settings.created;
        next();
    })
    */
    req.hash = hash;
    req.created = contest_settings.created;
    next();
}

module.exports = {
    createContest
};