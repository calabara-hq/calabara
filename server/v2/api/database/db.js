const { Pool } = require('pg')
require('dotenv').config({path: __dirname + '/./../../../.env'})

let config;

if (process.env.NODE_ENV == 'production') {
    console.log('production run')
    config = {
        user: process.env.PROD_DB_USER,
        host: process.env.PROD_DB_HOST,
        database: process.env.PROD_DB,
        password: process.env.PROD_DB_PASSWORD,
        port: process.env.PROD_DB_PORT,
    };
}

if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
    console.log('development run')
    config = {
        user: process.env.DEV_DB_USER,
        host: process.env.DEV_DB_HOST,
        database: process.env.DEV_DB,
        password: process.env.DEV_DB_PASSWORD,
        port: process.env.DEV_DB_PORT,
    };
}



const db = new Pool(config)



module.exports = db;