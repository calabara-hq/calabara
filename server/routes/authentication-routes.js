const express = require('express');
const db = require('../helpers/db-init.js')
const dotenv = require('dotenv')
const authentication = express();
authentication.use(express.json())
const { clean } = require('../helpers/common')
const { SiweMessage } = require('siwe')
dotenv.config();


const randomNonce = (length) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}




authentication.post('/generate_nonce', async function (req, res, next) {
    const { address } = req.body;
    let nonce = randomNonce(25)
    await db.query('insert into users (address, nonce) values ($1, $2) on conflict (address) do update set nonce = $2', [address, nonce]);
    res.send({ nonce: nonce });
    res.status(200);
})


authentication.post('/generate_session', async function (req, res, next) {
    // const nonce_result = await db.query('select nonce from users where address = $1', [address]).then(clean)

    // verify the signature
    try {
        const { message, signature } = req.body;
        const siweMessage = new SiweMessage(message)
        const fields = await siweMessage.validate(signature)

        // update the nonce

        const new_nonce = randomNonce(25);
        await db.query('update users set nonce = $2 where address = $1 returning twitter', [fields.address, new_nonce]);

        // generate a token

        req.session.user = { address: fields.address }
        res.send({ user: req.session.user }).status(200)

    } catch (e) {
        console.log(e)
        res.sendStatus(401)
    }
})

authentication.get('/signOut', async function (req, res, next) {
    req.session.destroy()
    res.sendStatus(200)
})


authentication.get('/isAuthenticated', async function (req, res, next) {
    if (!(req.sessionID && req.session.user)) return res.send({ authenticated: false }).status(200)
    return res.send({ authenticated: true, user: req.session.user }).status(200)
})


module.exports = {
    authentication
}