const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const asyncfs = require('fs').promises;
const views = require('co-views')
const bodyParser = require('body-parser')
const googleCalendar = require('../helpers/google-calendar')
const dotenv = require('dotenv');
const axios = require('axios');
const db = require('../helpers/db-init')
const util = require('util')

const { discordApp, getGuildRoles } = require('./discord-routes')
const { verifySignature, verifySignerIsAdmin } = require('../helpers/edcsa-auth')
const { authentication } = require('./authentication-routes')
const { authenticateToken } = require('../middlewares/jwt-middleware')



dotenv.config();


if (!process.env.NODE_ENV) {
  console.log('please pass NODE_ENV. Available options are dev and prod')
}


let key = fs.readFileSync("localhost.key", "utf-8");
let cert = fs.readFileSync("localhost.cert", "utf-8");


//const db = new Pool(db_init().db)


const buildPath = path.normalize(path.join(__dirname, '../client/build'));
app.use(express.static(buildPath));

const imgPath = path.normalize(path.join(__dirname, 'img'));
app.use(express.static(imgPath));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json())

app.use('/discord', discordApp)
app.use('/authentication', authentication)




app.get('/img/*', function (req, res, next) {
  res.sendFile(path.join(imgPath, req.url.split('/').slice(2).join('/')))

})



async function query(query, params) {
  const data = await pool.query(query, params);
  return data;
}


function clean(data) {
  if (data.rows.length == 0) { return null }
  else if (data.rows.length == 1) { return data.rows[0] }
  else { return data.rows }

}

// adjust db result to make sure we always get data in an array or null.
function asArray(data) {
  if (Array.isArray(data)) {
    return data
  }
  else if (data != null) {
    return [data]
  }
  return []

}


async function fileToDataUrl(filePath) {
  var base64Image = await asyncfs.readFile(filePath, { encoding: 'base64' });
  var fileExt = filePath.split('.').pop();
  var encoded = 'data:image/' + fileExt + ';base64,' + base64Image;
  return encoded

}









