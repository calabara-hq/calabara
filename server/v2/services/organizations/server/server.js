const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const organizations = require('../routes/routes')
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json())
app.use('/hub/organizations', organizations)


module.exports = app;