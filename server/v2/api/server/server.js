const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
//const { ROUTES } = require('./routes')
//const { setupProxies } = require('./proxy')
const { apiProxy } = require('../controllers/authentication')
const { createProxyMiddleware } = require('http-proxy-middleware');

dotenv.config();


const buildPath = path.normalize(path.join(__dirname, '../../../../client/build'));
const creatorContestDataPath = path.normalize(path.join(__dirname, '../../../contest-assets'));
const imgPath = path.normalize(path.join(__dirname, '../../../img'));


app.use(express.static(buildPath));
app.use(express.static(imgPath));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json())

app.use('/authentication/*', createProxyMiddleware({ target: 'http://192.168.1.224:5050', changeOrigin: true ,}));


app.get('/img/*', function (req, res, next) {
    res.sendFile(path.join(imgPath, req.url.split('/').slice(2).join('/')))
})

app.get('/contest-assets/*', function (req, res, next) {
    res.sendFile(path.join(creatorContestDataPath, req.url.split('/').slice(2).join('/')))
})


app.get('/*', function (req, res, next) {
    res.sendFile(path.join(buildPath, 'index.html'))
});


module.exports = app;