const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db");
const multer = require("multer");

const upload = multer();

app.use(cors());
app.use(express.json());

app.get("/list", async (req, res) => {
  try {
    let response = await pool.query("SELECT * FROM products");
    res.json(response.rows);
  } catch (error) {
    console.error(error);
  }
});

app.get("/image/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT image FROM products WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) return res.status(404).send("not found");

    const image = result.rows[0].image;
    res.set("Content-Type", "image/jpeg"); // or png if needed
    res.send(image);
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }
});

app.post("/post", upload.single("image"), async (req, res) => {
  try {
    const { name, discription, price, type } = req.body;
    const image = req.file.buffer;
    let response = await pool.query(
      "INSERT INTO products (name, discription, price, type, date, image) VALUES ($1, $2, $3, $4, CURRENT_DATE, $5) RETURNING *",
      [name, discription, price, type, image]
    );
    res.send("added!");
  } catch (error) {
    console.error(error);
  }
});

app.listen(3000, () => {
  console.log("server started at port 3000");
});
