const router = require("express").Router();
const dotenv = require("dotenv");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const verifyUser = require("../utils/verifyUser");
dotenv.config();
const jwt = require("jsonwebtoken");

router
  .get("/user", verifyUser, async (req, res) => {
    const { user } = req;
    console.log(user);
    const u_data = await User.findOne({ _id: user.id });
    const res_obj = {};
    res_obj.email = u_data.email;
    res.status(200).json(res_obj);
  })
  .post("/register", async (req, res) => {
    const { email, password } = req.body;
    // check is user already registered with this email

    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(200)
        .send({ message: "User already registered", error: true });
    }

    // now first hash the password
    const hashed = await bcryptjs.hash(password, 10);
    const newUser = User({
      email,
      password: hashed,
    });
    newUser
      .save()
      .then((isSaved) => {
        if (isSaved) {
          res
            .status(200)
            .send({ error: false, message: "User Registration Successful" });
        }
      })
      .catch((err) => {
        res
          .status(500)
          .send({ error: err, message: "User Registration Failed" });
      });
  })
  .post("/login", async (req, res) => {
    const { email, password } = req.body;
    // check is a user registered there or not

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(200).send({
        message: "No user found with this email address",
        error: true,
      });
    }
    // now check password also
    const is_valid = await bcryptjs.compare(password, user.password);
    if (!is_valid) {
      return res.status(200).send({
        message: "username & password does not match",
        error: true,
      });
    }

    // create a auth token and send it to client
    const token = await jwt.sign({ id: user._id }, process.env.APP_SECERT, {
      expiresIn: "1h",
    });
    res.status(200).send({ token: token });
  });

module.exports = router;
