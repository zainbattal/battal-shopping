const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const jwt = require("jsonwebtoken");

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
     WHERE user_id = $2
     AND NOT ($1 = ANY(saved_products));`,
      [id, decoded.user]
    );
    console.log(response);
    res.json(response);
  } catch (error) {
    res.json(error.message);
  }
});

router.get("/getSaved", async (req, res) => {
  try {
    const token = req.header("token");
    const decoded = jwt.verify(token, process.env.jwtSecret);

    const userRow = await pool.query("select * from users where user_id = $1", [
      decoded.user,
    ]);

    const user = userRow.rows[0].user_name;

    const response = await pool.query(
      `SELECT saved_products FROM users WHERE user_name = $1`,
      [user]
    );

    res.json(response.rows[0]);
  } catch (error) {
    res.json(error.message);
  }
});

router.post("/getProductsSaved", async (req, res) => {
  try {
    const { data2 } = req.body;

    const response = await pool.query(
      "SELECT * FROM products WHERE id = ANY($1) ORDER BY array_position($1, id)",
      [data2]
    );
    console.log(response.rows);
    console.log(data2 + "this is data");
    res.json(response.rows);
  } catch (error) {
    res.json(error.message);
  }
});

router.delete("/unsave/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.header("token");
    const decoded = jwt.verify(token, process.env.jwtSecret);

    const userRow = await pool.query("select * from users where user_id = $1", [
      decoded.user,
    ]);
    const user = userRow.rows[0].user_name;

    const productId = String(id).trim();
    const response = await pool.query(
      `UPDATE users
SET saved_products = array_remove(saved_products, $1)
WHERE user_name = $2;`,
      [productId, user]
    );
    res.json("product unsaved");
  } catch (error) {
    console.error(error.message);
    res.json("couldn't delete product");
  }
});

// get name

router.post("/username", async (req, res) => {
  try {
    const token = req.header("token");
    const decoded = jwt.verify(token, process.env.jwtSecret);

    const userRow = await pool.query(
      "select user_name from users where user_id = $1",
      [decoded.user]
    );
    res.json(userRow.rows[0]);
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;
