require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || 'catalogo_db',
  user: process.env.PGUSER || 'catalogo_user',
  password: process.env.PGPASSWORD,
});

module.exports = pool;
