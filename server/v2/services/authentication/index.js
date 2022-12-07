const express = require('express');
const db = require('./db.js')
const dotenv = require('dotenv')
const app = express();
const { SiweMessage } = require('siwe');
const logger = console.log//require('../logger.js').child({ service: 'authentication' })
app.use(express.json())
dotenv.config();


const randomNonce = (length) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

app.post('/generate_nonce', async function (req, res, next) {
    const { address } = req.body;
    let nonce = randomNonce(25)
    await db.query('insert into users (address, nonce) values ($1, $2) on conflict (address) do update set nonce = $2', [address, nonce]);
    res.send({ nonce: nonce });
    res.status(200);
})


app.post('/generate_session', async function (req, res, next) {
    // verify the signature
    try {
        const { message, signature } = req.body;
        const siweMessage = new SiweMessage(message)
        const fields = await siweMessage.validate(signature)

        // update the nonce

        const new_nonce = randomNonce(25);
        await db.query('update users set nonce = $2 where address = $1', [fields.address, new_nonce]);

        // generate a token

        req.session.user = { address: fields.address }
        res.send({ user: req.session.user }).status(200)
        logger.log({ level: 'info', message: 'successfully authenticated user' })


    } catch (err) {
        logger.log({ level: 'info', message: `problem authenticating with error: ${err}` })
        res.sendStatus(401)
    }
})

app.get('/signOut', async function (req, res, next) {
    req.session.destroy()
    res.sendStatus(200)
    logger.log({ level: 'info', message: 'user successfully signed out' })
})


app.get('/authentication/isAuthenticated', async function (req, res, next) {
    if (!(req.sessionID && req.session.user)) return res.send({ authenticated: false }).status(200)
    return res.send({ authenticated: true, user: req.session.user }).status(200)
})



app.listen(5050, () => {
    console.log('authentication service up and running')
})