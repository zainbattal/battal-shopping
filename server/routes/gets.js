const router = require("express").Router();
const { use } = require("react");
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post("/saveOne", async (req, res) => {
  try {
    const { id } = req.body;
    const token = req.header("token");
    const decoded = jwt.verify(token, process.env.jwtSecret);

    const userRow = await pool.query("select * from users where user_id = $1", [
      decoded.user,
    ]);
    const user = userRow.rows[0].user_name;

    const response = await pool.query(
      `UPDATE users
     SET saved_products = saved_products || $1
     WHERE user_name = $2
     AND NOT ($1 = ANY(saved_products));`,
      [id, user]
    );

    res.json(response);
  } catch (error) {
    res.json(error.message);
  }
});

router.get("/getSaved", async (req, res) => {
  try {
    const { id } = req.body;
    const token = req.header("token");
    const decoded = jwt.verify(token, process.env.jwtSecret);

    const userRow = await pool.query("select * from users where user_id = $1", [
      decoded.user,
    ]);
    const user = userRow.rows[0].user_name;

    const response = await pool.query(
      `SELECT saved_products FROM users WHERE user_name = $2`,
      [id, user]
    );

    res.json(response.rows[0]);
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;
