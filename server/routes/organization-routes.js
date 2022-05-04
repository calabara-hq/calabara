const express = require('express');
const db = require('../helpers/db-init.js')
const dotenv = require('dotenv')
const path = require('path')
const organizations = express();
organizations.use(express.json())
const { authenticateToken } = require('../middlewares/jwt-middleware.js');
const { clean, asArray } = require('../helpers/common')

// get organizations
organizations.get('/organizations', async function (req, res, next) {

    var result = await db.query('select name, members, logo, verified, ens from organizations').then(clean).then(asArray);

    res.status(200);
    //
    res.send(result)

});

// get subscriptions
organizations.get('/getSubscriptions/*', async function (req, res, next) {

    const address = req.url.split('/')[2];

    var subbed = await db.query('select subscription from subscriptions where address = $1', [address]).then(clean).then(asArray);
    res.status(200);
    res.send(subbed.map(el => el.subscription))

});

organizations.get('/doesEnsExist/*', async function (req, res, next) {

    const ens = req.url.split('/')[2]

    var result = await db.query('select exists (select id from organizations where ens = $1)', [ens]).then(clean);

    res.status(200);
    res.send(result.exists)

});


// post a new subscription
organizations.post('/addSubscription', authenticateToken, async function (req, res, next) {

    const { address, ens } = req.body;

    await db.query('insert into subscriptions (address, subscription) values ($1, $2)', [address, ens]);
    await db.query('update organizations set members = members + 1 where ens = $1', [ens])
    res.status(200);
    res.send('done')

});

// remove a new subscription
organizations.post('/removeSubscription', authenticateToken, async function (req, res, next) {

    const { address, ens } = req.body;
    await db.query('delete from subscriptions where address = $1 AND subscription = $2', [address, ens]);
    await db.query('update organizations set members = members - 1 where ens = $1', [ens])
    res.status(200);
    res.send('done')

});

/* 
this is more complex in the case that a user is updating an orgs settings.
in the simple case (new org), we just need to make sure that the name is unique
in the complex case (existing org), the name can exist so long as it is only owned by the ens it's tied to.
*/
organizations.post('/doesNameExist', async function (req, res, next) {

    const { name, ens } = req.body;
    console.log(req.body)
    var result = await db.query('select exists (select id from organizations where name = $1 and ens != $2)', [name.toLowerCase(), ens]).then(clean);
    res.status(200);
    res.send(result.exists)

});


module.exports.organizations = organizations;