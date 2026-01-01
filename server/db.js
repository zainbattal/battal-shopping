const { Pool } = require("pg");

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Required for Neon's free tier
      },
    }
  : {
      user: "postgres",
      database: "test",
      port: 5432,
      host: "localhost",
      password: "zezo2009zezo",
    };

const pool = new Pool(poolConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
