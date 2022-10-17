const express = require('express');
const db = require('../helpers/db-init.js')
const dotenv = require('dotenv')
const path = require('path')
const ipfs = express();
ipfs.use(express.json())
const asyncfs = require('fs').promises;
const { authenticateToken } = require('../middlewares/auth-middleware.js');
const { isAdmin } = require('../middlewares/admin-middleware');
const { imageUpload } = require('../middlewares/image-upload-middleware');
const { testAuthentication, pinFile } = require('../helpers/ipfs-api.js');


ipfs.post('/upload_img', async (req, res) => {

    let isAuth = await testAuthentication();
    console.log(isAuth)

    console.log(file)

    /*
    let pin = await pinFile(req, {pinataOptions: {cidVersion: 0}})
    console.log(pin)
*/
    /*
    let img_data = {
        success: 1,
        file: {
            url: '/' + req.file.path
        }
    }
    res.send(img_data)
    console.log(req.file)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })

    */
   res.sendStatus(200)
})

module.exports.ipfs = ipfs;