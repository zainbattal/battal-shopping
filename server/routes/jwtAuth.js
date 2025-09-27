const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const authorization = require("../middleware/authorization");
// register

router.post("/register", async (req, res) => {
  try {
    let { name, number, password } = req.body;

    name = name.trim().toLowerCase();

    // some error handlings
    if (Number(number.toString()[0]) !== 9) {
      return res.status(401).send("not a uasable number");
    }
    if (number.length !== 9 || number < 0) {
      return res.status(401).send("not a uasable number");
    }

    // check if user exists
    const user = await pool.query("select * from users where user_name = $1", [
      name,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).send("user already exists");
    }

    // bctypt user password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptPassword = await bcrypt.hash(password, salt);

    // enter new user into database
    const newUser = await pool.query(
      "insert into users (user_name, user_number, user_password) values ($1, $2, $3) returning *",
      [name, number, bcryptPassword]
    );
    // create jwt token
    const token = jwtGenerator(newUser.rows[0].user_id);
    res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});

// login route

router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    //check if user doesn't exist

    name = name.trim().toLowerCase();

    const user = await pool.query("select * from users where user_name = $1", [
      name,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("username or password is incorrect");
    }

    // check if incoming password is the same as the db password

    const vaildPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!vaildPassword) {
      return res.status(401).json("password or username is incorrect");
    }
    //give jwt token
    const token = jwtGenerator(user.rows[0].user_id);
    res.json({ token });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/is-authorized", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
