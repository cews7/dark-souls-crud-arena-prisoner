import { config } from './config.js';
import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    ssl: config.database.ssl
});

export default pool;

