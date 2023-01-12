const express = require('express');
const db = require('../helpers/db-init.js')
const organizations = express();
organizations.use(express.json())
const { authenticateToken } = require('../middlewares/auth-middleware.js');
const { clean, asArray } = require('../helpers/common')

// get organizations
organizations.get('/organizations', async function (req, res, next) {
    var orgs = await db.query('select name, members, logo, verified, ens from organizations').then(clean).then(asArray)
    res.send(orgs).status(200)
});

// get subscriptions
organizations.get('/getSubscriptions/*', async function (req, res, next) {
    const address = req.url.split('/')[2];
    var subbed = await db.query('select subscription from subscriptions where address = $1', [address]).then(clean).then(asArray);
    res.status(200);
    res.send(subbed.map(el => el.subscription))

});

organizations.get('/doesEnsExist', async function (req, res, next) {
    const { ens } = req.query
    var result = await db.query('select exists (select id from organizations where ens = $1)', [ens]).then(clean);
    res.send(result.exists).status(200)
});

organizations.get('/doesNameExist', async function (req, res, next) {
    const { name, ens } = req.query;
    var result = await db.query('select exists (select id from organizations where name = $1 and ens != $2)', [name.toLowerCase(), ens]).then(clean);
    res.send(result.exists).status(200)
});

// post a new subscription
organizations.post('/addSubscription', authenticateToken, async function (req, res, next) {
    const { ens } = req.body;
    const address = req.session.user.address;
    await db.query('insert into subscriptions (address, subscription) values ($1, $2)', [address, ens]);
    await db.query('update organizations set members = members + 1 where ens = $1', [ens])
    res.send('done').status(200);
});

// remove a new subscription
organizations.post('/removeSubscription', authenticateToken, async function (req, res, next) {
    const { ens } = req.body;
    const address = req.session.user.address;
    await db.query('delete from subscriptions where address = $1 AND subscription = $2', [address, ens]);
    await db.query('update organizations set members = members - 1 where ens = $1', [ens])
    res.send('done').status(200);

});



module.exports.organizations = organizations;