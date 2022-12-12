const logger = console.log//require('../logger.js').child({ service: 'authentication' })
const http = require('http');
const app = require('./server/server')
var server = http.createServer(app)

server.listen(5050, () => {
    console.log('organization service up and running')
})
