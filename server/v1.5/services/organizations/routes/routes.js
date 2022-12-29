const express = require('express');
const db = require('../database/knexfile.js')
const app = express();
const { clean, asArray } = require('../helpers/helpers')
const { authenticateToken } = require('../middleware/auth-middleware')

// get organizations
app.get('/organizations', async function (req, res, next) {
    var orgs = await db.query('select name, members, logo, verified, ens from organizations').then(clean).then(asArray)
    res.send(orgs).status(200)
});

app.get('/getSubscriptions', async function (req, res, next) {
    const { address } = req.query
    var subbed = await db.query('select subscription from subscriptions where address = $1', [address]).then(clean).then(asArray);
    res.status(200);
    res.send(subbed.map(el => el.subscription))

});

app.get('/doesEnsExist', async function (req, res, next) {
    const { ens } = req.query
    var result = await db.query('select exists (select id from organizations where ens = $1)', [ens]).then(clean);
    res.send(result.exists).status(200)
});

app.get('/doesNameExist', async function (req, res, next) {
    const { name, ens } = req.query;
    var result = await db.query('select exists (select id from organizations where name = $1 and ens != $2)', [name.toLowerCase(), ens]).then(clean);
    res.send(result.exists).status(200)
});

app.post('/addSubscription', authenticateToken, async function (req, res, next) {
    const { ens } = req.body;
    const address = req.session.user.address;
    await db.query('insert into subscriptions (address, subscription) values ($1, $2)', [address, ens]);
    await db.query('update organizations set members = members + 1 where ens = $1', [ens])
    res.send('done').status(200);
});

app.post('/removeSubscription', authenticateToken, async function (req, res, next) {
    const { ens } = req.body;
    const address = req.session.user.address;
    await db.query('delete from subscriptions where address = $1 AND subscription = $2', [address, ens]);
    await db.query('update organizations set members = members - 1 where ens = $1', [ens])
    res.send('done').status(200);

});


module.exports = app;