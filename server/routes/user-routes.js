const express = require('express');
const db = require('../helpers/db-init.js')
const dotenv = require('dotenv')
const path = require('path')
const user = express();
user.use(express.json())
const { authenticateToken } = require('../middlewares/jwt-middleware.js');
const { clean } = require('../helpers/common')

user.post('/registerUser', async function (req, res, next) {
    const { address } = req.body;

    let result = await db.query('insert into users (address) values $1 on conflict (address) do update set address = $1 returning discord', [address]).then(clean);

    res.send({ discordId: JSON.stringify(result.discord) });
    res.status(200);
})

user.post('/valid_wl', async function (req, res, next) {
    const { address } = req.body

    const result = await db.query('select exists (select 1 from whitelist where address = $1)', [address]).then(clean);
    console.log(address)
    console.log(result.exists)
    res.send(result.exists)
    res.status(200);

})

module.exports.user = user;