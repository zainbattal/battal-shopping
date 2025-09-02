const { Pool } = require("pg");

const pool = new Pool({
  // user: "postgres",
  // database: "test",
  // port: " 5432",
  // host: "localhost",
  // password: "",

  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon's free tier
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
