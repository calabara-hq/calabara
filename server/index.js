const http = require('http');
const https = require('https');
const app = require('./server');
const fs = require('fs');
const dotenv = require('dotenv');
const initialize_cron = require('./sys/cron/main')
dotenv.config();
const initialize_discord_bot = require('./discord-bot/deploy-commands.js')
const { socketConnection } = require('./sys/socket/socket-io')
const twitterStream = require('./twitter-client/stream'); // keep this
const logger = require('./logger').child({ service: 'index' })


if (!process.env.NODE_ENV) {
    console.error('Please pass NODE_ENV. Available options are development | production | testing')
}


let key = fs.readFileSync("localhost.key", "utf-8");
let cert = fs.readFileSync("localhost.cert", "utf-8");


var server = http.createServer(app)
var secureServer = https.createServer({ key, cert }, app);



if (process.env.NODE_ENV === 'development') {
    secureServer.listen(3001, () => {
        socketConnection(secureServer)
        initialize_cron();
        initialize_discord_bot()
            .then(res => logger.log({ level: 'info', message: res }))
            .then(logger.log({ level: 'info', message: 'Running on port 3001' }))
            .then(() => secureServer.emit('app_started'))
    })
}

else if (process.env.NODE_ENV === 'production') {
    server.listen(80)
    socketConnection(secureServer)
    secureServer.listen(443, () => {
        initialize_cron();
        initialize_discord_bot()
            .then(res => logger.log({ level: 'info', message: res }))
            .then(logger.log({ level: 'info', message: 'Running on port 443' }))
            .then(() => secureServer.emit('app_started'))
    })
}




