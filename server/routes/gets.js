const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post("/saveOne", async (req, res) => {
  try {
    const { id } = req.body;

    const response = await pool.query(
      `UPDATE users
         SET saved_products = saved_products || $1
         WHERE user_name = 'zezo';
`,
      [id]
    );

    res.json(response);
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;
