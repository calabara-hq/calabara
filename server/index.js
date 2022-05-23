const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser')
const dotenv = require('dotenv');

const { discordApp } = require('./routes/discord-routes')
const { authentication } = require('./routes/authentication-routes')
const { settings } = require('./routes/settings-routes')
const { dashboard } = require('./routes/dashboard-routes')
const { organizations } = require('./routes/organization-routes')
const { wiki } = require('./routes/wiki-routes')
const { user } = require('./routes/user-routes')
dotenv.config();


if (!process.env.NODE_ENV) {
    console.log('please pass NODE_ENV. Available options are dev and prod')
}


let key = fs.readFileSync("localhost.key", "utf-8");
let cert = fs.readFileSync("localhost.cert", "utf-8");



const buildPath = path.normalize(path.join(__dirname, '../client/build'));
app.use(express.static(buildPath));

const imgPath = path.normalize(path.join(__dirname, 'img'));
app.use(express.static(imgPath));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json())

app.use('/discord', discordApp)
app.use('/authentication', authentication)
app.use('/settings', settings)
app.use('/dashboard', dashboard)
app.use('/organizations', organizations)
app.use('/wiki', wiki)
app.use('/user', user)

app.get('/img/*', function (req, res, next) {
    res.sendFile(path.join(imgPath, req.url.split('/').slice(2).join('/')))

})

app.get('/*', function (req, res, next) {
    res.sendFile(path.join(buildPath, 'index.html'))
});


var server = http.createServer(app)
var secureServer = https.createServer({ key, cert }, app);

if (process.env.NODE_ENV == 'development') {
    secureServer.listen(3001)
    console.log('Running at Port 3001');
}

else if (process.env.NODE_ENV === 'production') {
    server.listen(80)
    secureServer.listen(443)
    console.log('Running at Port 443');

}

