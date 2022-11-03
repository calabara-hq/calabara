const { Pool } = require('pg')
const dotenv = require('dotenv')

dotenv.config();


const db_init = () => {


    let config;

    if (process.env.NODE_ENV == 'production') {
        console.log('production run')
        config = {
            db: {
                user: process.env.PROD_DB_USER,
                host: process.env.PROD_DB_HOST,
                database: process.env.PROD_DB,
                password: process.env.PROD_DB_PASSWORD,
                port: process.env.PROD_DB_PORT,
            }
        };


    }

    if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
        console.log('development run')

        config = {
            db: {
                user: process.env.DEV_DB_USER,
                host: process.env.DEV_DB_HOST,
                database: process.env.DEV_DB,
                password: process.env.DEV_DB_PASSWORD,
                port: process.env.DEV_DB_PORT,
            }
        };

    }

    return config
}

const db = new Pool(db_init().db)

/*
const serialized_query = async () => {

}
*/


module.exports = db;