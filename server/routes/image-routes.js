const express = require('express');
const db = require('../helpers/db-init.js')
const dotenv = require('dotenv')
const path = require('path')
const image = express();
image.use(express.json())
const asyncfs = require('fs').promises;
const { authenticateToken } = require('../middlewares/jwt-middleware.js');
const { isAdmin } = require('../middlewares/admin-middleware');
const { imageUpload } = require('../middlewares/image-upload-middleware')




image.post('/upload_img', imageUpload.single('image'), async (req, res) => {
    console.log(req.body)
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
})

module.exports.image = image;