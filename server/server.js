const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser')
const { secure_session } = require('./session/session')
const { authentication } = require('./routes/authentication-routes')
const { settings } = require('./routes/settings-routes')
const { dashboard } = require('./routes/dashboard-routes')
const { organizations } = require('./routes/organization-routes')
const { wiki } = require('./routes/wiki-routes')
const { user } = require('./routes/user-routes')
const { contests } = require('./routes/creator-contests');
const { discordApp } = require('./routes/discord-routes')
const { twitter } = require('./routes/twitter-routes')

const dotenv = require('dotenv')
dotenv.config();


const buildPath = path.normalize(path.join(__dirname, '../client/build'));
app.use(express.static(buildPath));

const imgPath = path.normalize(path.join(__dirname, 'img'));
app.use(express.static(imgPath));

const creatorContestDataPath = path.normalize(path.join(__dirname, 'contest-assets'));


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json())
app.use(secure_session)

app.use('/discord', discordApp)
app.use('/authentication', authentication)
app.use('/settings', settings)
app.use('/dashboard', dashboard)
app.use('/organizations', organizations)
app.use('/wiki', wiki)
app.use('/user', user)
app.use('/creator_contests', contests)
app.use('/twitter', twitter)

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