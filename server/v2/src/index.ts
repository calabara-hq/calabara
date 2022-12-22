import app from './gateway/index';
import http from 'http';
import https from 'https';
import fs from 'fs';
import waitOn from 'wait-on';

const logger = console.log//require('./logger').child({ service: 'index' })


if (!process.env.NODE_ENV) {
    console.error('Please pass NODE_ENV. Available options are production | development | test')
}


let key = fs.readFileSync("../localhost.key", "utf-8");
let cert = fs.readFileSync("../localhost.cert", "utf-8");


var server = http.createServer(app)
var secureServer = https.createServer({ key, cert }, app);



if (process.env.NODE_ENV === 'development') {
    waitOn({ resources: ['tcp:5050'] }, async () => {
        secureServer.listen(3001, () => {
            console.log('gateway initialized')
        })
    })
}

