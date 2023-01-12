const express = require('express');
const db = require('../helpers/db-init.js')
const user = express();
user.use(express.json())
const { clean } = require('../helpers/common')

user.get('/fetch_discord_id/*', async function (req, res, next) {
    const address = req.url.split('/')[2]
    let result = await db.query('select discord from users where address = $1', [address]).then(clean);
    res.send({ discordId: result.discord });
    res.status(200);
})

user.post('/valid_wl', async function (req, res, next) {
    const { address } = req.body
    const result = await db.query('select exists (select 1 from whitelist where address = $1)', [address]).then(clean);
    res.send(result.exists)
    res.status(200);

})

module.exports.user = user;