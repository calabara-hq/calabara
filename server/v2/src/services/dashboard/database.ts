import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { DBConfig } from '../../lib/interfaces'

dotenv.config({ path: path.normalize(path.join(__dirname + '../../../../../.env')) })


const defineConfig = () => {
    if (process.env.NODE_ENV == 'production') {
        return {
            db: {
                user: process.env.PROD_DB_USER,
                host: process.env.PROD_DB_HOST,
                database: process.env.PROD_DB,
                password: process.env.PROD_DB_PASSWORD,
                port: process.env.PROD_DB_PORT,
            }
        };
    }

    return {
        db: {
            user: process.env.DEV_DB_USER,
            host: process.env.DEV_DB_HOST,
            database: process.env.DEV_DB,
            password: process.env.DEV_DB_PASSWORD,
            port: process.env.DEV_DB_PORT,
        }
    };

}

let config: DBConfig = defineConfig();
const db = new Pool(config.db)

export default db;