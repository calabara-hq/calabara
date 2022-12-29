const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser')
const { createProxyMiddleware } = require('http-proxy-middleware');
const authentication = require('../routes/authentication')
const secure_session = require('../session/session')
const buildPath = path.normalize(path.join(__dirname, '../../../../client/build'));
const creatorContestDataPath = path.normalize(path.join(__dirname, '../../../contest-assets'));
const imgPath = path.normalize(path.join(__dirname, '../../../img'));


app.use(secure_session)

/*
app.use('/hub/*', createProxyMiddleware({
    target: 'http://[::1]:5050', changeOrigin: true,
    onProxyReq: function onProxyReq(proxyReq, req, res) {
        if (req.session) {
            proxyReq.setHeader('Cookie', JSON.stringify(req.session))
        }
    },
    onProxyRes: function onProxyRes(proxyRes, req, res) {
        if (proxyRes.headers['set-cookie']) {
            res.setHeader('Set-Cookie', proxyRes.headers['set-cookie'])
        }
    }
}));
*/
app.use(express.json())
app.use(express.static(buildPath));
app.use(express.static(imgPath));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/authentication', authentication)

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