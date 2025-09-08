const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db");
const multer = require("multer");
const jwt = require("jsonwebtoken");

const upload = multer();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.post("/list", async (req, res) => {
  try {
    const { catFilter, priceFilter, cityFilter } = req.body;
    console.log(catFilter);
    console.log(priceFilter);
    if (catFilter === "all") {
      response = await pool.query(
        "SELECT * FROM products WHERE price < $1 and city = $2",
        [priceFilter, cityFilter]
      );
    } else {
      response = await pool.query(
        "SELECT * FROM products WHERE type = $1 AND price < $2 and city = $3",
        [catFilter, priceFilter, cityFilter]
      );
    }
    res.json(response.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.header("token");
    const decoded = jwt.verify(token, process.env.jwtSecret);

    const userRow = await pool.query("select * from users where user_id = $1", [
      decoded.user,
    ]);
    const user = userRow.rows[0].user_name;

    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    const productUser = await product.rows[0].uploader;

    if (user !== productUser) {
      return res
        .status(403)
        .json("you do not have the ability to delete this product");
    }

    const response = await pool.query("DELETE FROM products WHERE id = $1", [
      id,
    ]);
    res.json("product deleted");
  } catch (error) {
    console.error(error.message);
    res.json("couldn't delete product");
  }
});

app.get("/profile", async (req, res) => {
  try {
    const token = req.header("token");
    const decoded = jwt.verify(token, process.env.jwtSecret);

    const userRow = await pool.query("select * from users where user_id = $1", [
      decoded.user,
    ]);

    const user = userRow.rows[0].user_name;

    let response = await pool.query(
      "SELECT * FROM products WHERE uploader = $1",
      [user]
    );
    res.json(response.rows);
  } catch (error) {
    console.error(error.message);
    res.status(401);
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
    const { name, discription, price, type, city } = req.body;
    const image = req.file.buffer;
    const token = req.header("token");
    const decoded = jwt.verify(token, process.env.jwtSecret);

    const userRow = await pool.query("select * from users where user_id = $1", [
      decoded.user,
    ]);

    const user = userRow.rows[0].user_name;
    const userNumber = userRow.rows[0].user_number;

    let response = await pool.query(
      "INSERT INTO products (name, discription, price, type, date, image, uploader, uploader_number, city) VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, $6, $7, $8) RETURNING *",
      [name, discription, price, type, image, user, userNumber, city]
    );
    res.send("added!");
  } catch (error) {
    console.error(error);
  }
});

// routes

app.post("/search", async (req, res) => {
  try {
    const { input, catFilter, cityFilter, priceFilter } = req.body;

    if (catFilter === "all") {
      response = await pool.query(
        `SELECT * FROM products 
         WHERE (SIMILARITY(name, $1) > 0.2 OR SIMILARITY(discription, $1) > 0.2) 
         AND price < $2 AND city = $3`,
        [input, priceFilter, cityFilter]
      );
    } else {
      response = await pool.query(
        `SELECT * FROM products 
         WHERE (SIMILARITY(name, $1) > 0.2 OR SIMILARITY(discription, $1) > 0.2) 
         AND type = $2 AND price < $3 AND city = $4`,
        [input, catFilter, priceFilter, cityFilter]
      );
    }

    res.json(response.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/verify-turnstile", async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ success: false, message: "Missing token" });
  }

  try {
    const result = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET, // keep it in .env!
          response: token,
        }),
      }
    );

    const data = await result.json();
    if (data.success) {
      res.json({ success: true });
    } else {
      res.status(403).json({ success: false, message: "CAPTCHA failed" });
    }
  } catch (err) {
    console.error("Turnstile error:", err);
    res.status(500).json({ success: false });
  }
});

// register and login routed

app.use("/auth", require("./routes/jwtAuth"));

app.listen(3000, () => {
  console.log("server started at port 3000");
});
