const express = require('express');
const db = require('../helpers/db-init.js')
const dotenv = require('dotenv')
const path = require('path')
const asyncfs = require('fs').promises;
const settings = express();
settings.use(express.json())
const { authenticateToken } = require('../middlewares/jwt-middleware');
const { isAdmin } = require('../middlewares/admin-middleware')
const { clean } = require('../helpers/common')

const serverRoot = path.normalize(path.join(__dirname, '../'));


async function dataUrlToFile(url, filename) {
    var regex = /^data:.+\/(.+);base64(.*)$/;

    var matches = url.split(',');
    var ext = matches[0].match(regex)[1]
    var data = matches[1]
    if (ext == 'svg+xml') { ext = 'svg' }

    try {
        var buffer = Buffer.from(',' + data, 'base64');
        const child_path = path.normalize(path.join('img/logos/', filename + '.' + ext))
        var full_path = path.normalize(path.join(serverRoot, child_path));
        await asyncfs.writeFile(full_path, buffer);
        return child_path

    } catch (e) {
        console.log(e)
    }
}


const prepLogo = async (logo, ens) => {
    if (logo) {

        if (logo.startsWith('img/logos/')) {
            // if they haven't changed from the default, leave it as-is
            return logo
        }
        else {
            let res = await dataUrlToFile(logo, encodeURIComponent(ens))
            return res
        }
    }
    else {
        // give them a default logo if they haven't provided one
        return 'img/logos/default-logo.svg'
    }
}

settings.post('/updateSettings', authenticateToken, isAdmin, async function (req, res, next) {
    const { fields, sig, msg, walletAddress } = req.body

    // prep the logo path if a logo was provided
    let logoPath = await prepLogo(fields.logo, fields.ens);


    await db.query('insert into organizations (name, members, website, discord, logo, addresses, verified, ens)\
    values ($1, $2, $3, $4, $5, $6, $7, $8)\
    on conflict (ens)\
    do update set name=$1, members=$2, website=$3, discord=$4, logo=$5, addresses=$6, verified=$7', [fields.name, fields.members || 0, fields.website, fields.discord, logoPath, fields.addresses, false, fields.ens])


    // we allow updates to discord, so if discord exists in the db already, we have to update the entry at that rule_id


    for (var rule in fields.gatekeeper.rules) {
        if (fields.gatekeeper.rules[rule].gatekeeperType === 'discord') {
            let rule_id = await db.query('select rule_id from gatekeeper_rules where ens=$1 and rule ->> \'gatekeeperType\' = \'discord\'', [fields.ens]).then(clean);
            if (rule_id) {
                console.log('found rule id')
                db.query('update gatekeeper_rules set rule = $2 where rule_id = $1', [rule_id.rule_id, fields.gatekeeper.rules[rule]]);
            }
            else {
                await db.query('insert into gatekeeper_rules (ens, rule) values($1, $2)', [fields.ens, fields.gatekeeper.rules[rule]])
            }
        }

        else {
            await db.query('insert into gatekeeper_rules (ens, rule) values($1, $2)', [fields.ens, fields.gatekeeper.rules[rule]])
        }
    }

    //if we deleted any rules, now is the time to remove them from affected widgets
    console.log(fields.gatekeeper.rulesToDelete)

    for (const i in fields.gatekeeper.rulesToDelete) {
        const res = await db.query('delete from gatekeeper_rules where rule_id = $1 returning rule', [fields.gatekeeper.rulesToDelete[i]]).then(clean)
        if (res.rule.gatekeeperType === 'discord') {
            await db.query('delete from discord_guilds where ens = $1', [fields.ens])
        }
        await db.query("update widgets set gatekeeper_rules = gatekeeper_rules #- $1 where ens = $2", ['{' + fields.gatekeeper.rulesToDelete[i] + '}', fields.ens])

    }

    res.send({ error: false })
    res.status(200);

});

settings.post('/deleteOrganization', authenticateToken, isAdmin, async function (req, res, next) {
    const { ens, sig, msg, walletAddress } = req.body;

    await db.query('delete from organizations where ens = $1', [ens]);

    try {
        await asyncfs.rm(path.normalize(path.join(serverRoot, '/org-repository/', ens)), { recursive: true });
    } catch (e) {
        console.log(e)
    }
    res.status(200)
    res.send({ error: false })
});

module.exports.settings = settings;