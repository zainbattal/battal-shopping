const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "test",
  password: "zezo2009zezo",
  port: 5432, // default PostgreSQL port
});

// For production, use environment variables:
/*
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
*/

module.exports = {
  query: (text, params) => pool.query(text, params),
};
