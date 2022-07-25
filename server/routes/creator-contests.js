const express = require('express');
const db = require('../helpers/db-init.js')
const dotenv = require('dotenv')
const path = require('path')
const contests = express();
contests.use(express.json())
const asyncfs = require('fs').promises;
const fs = require('fs');
const FormData = require('form-data');
const { authenticateToken } = require('../middlewares/jwt-middleware.js');
const { isAdmin } = require('../middlewares/admin-middleware')
const { clean, asArray } = require('../helpers/common')
const { getGuildRoles } = require('./discord-routes')


const serverRoot = path.normalize(path.join(__dirname, '../'));




// send the settings for a contest
contests.get('/active/*', async function (req, res, next) {
    let ens = req.url.split('/')[2];

    let filestream = fs.createReadStream(path.join(serverRoot, 'creator-contests/sharkdao.eth/123/settings.json'))
        .on('end', function () {
            console.log('stream done')
        })
        .on('error', function (err) {
            res.send(err)
        })
        .pipe(res)
})



module.exports.contests = contests;