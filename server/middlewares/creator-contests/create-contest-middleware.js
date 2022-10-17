const path = require('path')
const crypto = require('crypto')
const serverRoot = path.normalize(path.join(__dirname, '../'));
const asyncfs = require('fs').promises;
const fs = require('fs');
const dotenv = require('dotenv');
const { calculateBlock } = require('../../web3/web3');

dotenv.config();

// generate a contest identifier hash

// create folder with hash and writestream and write file to disk

// pass hash and timestamp to endpoint


async function isNick(req, res, next) {

    if (((req.session.user.address != '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C') && (req.session.user.address != '0xe9ad38d6E38E0A9970D6ebEc84C73DEA3e025da1'))) return res.sendStatus(437)
    next()
}


async function createContest(req, res, next) {
    const { ens, contest_settings } = req.body;
    contest_settings.created = new Date().toISOString();
    contest_settings.sw_version = process.env.SW_VERSION;
    let hash = crypto.createHash('md5').update(JSON.stringify(contest_settings)).digest('hex').slice(-8);
    let snapshot = await calculateBlock(contest_settings.snapshot_block)
    contest_settings.snapshot_block = snapshot
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
    createContest,
    isNick
};