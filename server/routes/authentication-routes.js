const express = require('express');
const db = require('../helpers/db-init.js')
const dotenv = require('dotenv')
const authentication = express();
authentication.use(express.json())
const { verifySignature } = require('../helpers/edcsa-auth.js');
const jwt = require('jsonwebtoken');

dotenv.config();


const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;


const randomNonce = (length) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const clean = (data) => {
    if (data.rows.length == 0) { return null }
    else if (data.rows.length == 1) { return data.rows[0] }
    else { return data.rows }
}

const generate_access_token = (address) => {
    return jwt.sign({ address: address }, JWT_TOKEN_SECRET, { expiresIn: 20 });
}


authentication.post('/generate_nonce', async function (req, res, next) {
    const { address } = req.body;

    let nonce = randomNonce(25)
    await db.query('insert into users (address, nonce) values ($1, $2) on conflict (address) do update set nonce = $2', [address, nonce]);

    res.send({ nonce: nonce });
    res.status(200);
})


authentication.post('/generate_jwt', async function (req, res, next) {
    const { sig, address } = req.body;
    const nonce_result = await db.query('select nonce from users where address = $1', [address]).then(clean)
    console.log(nonce_result)
    const msg = `Signing one time message with nonce: ${nonce_result.nonce}`

    // verify the signature
    try {
        console.log(sig, msg, address)
        let signatureResult = await verifySignature(sig, msg, address)
        console.log(signatureResult)
        // update the nonce

        const new_nonce = randomNonce(25);
        await db.query('update users set nonce = $2 where address = $1', [address, new_nonce]);

        // generate a token

        if (signatureResult) {
            let jwt = generate_access_token(address)
            res.send({ jwt: jwt })
            res.status(200)
        }
        else {
            res.status(401)
            res.send('error')
        }
    } catch (e) {
        res.status(401)
        res.send('error')
    }
})



module.exports = {
    authentication
}