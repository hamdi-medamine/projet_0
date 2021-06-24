const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const authMiddleware = require("../helpers/authMiddleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const user = require("../models/user");
require("dotenv").config({ path: "./config/.env" });
// Load connected user

router.get("/", authMiddleware, (req, res) => {
  user
    .findById(req.userId)
    .select("-password -__v")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ msg: "User not found !" });
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500).send({ msg: "Server error" });
    });
});

// Login user

router.post(
  "/",
  [
    body("email", "Please enter a valid e-mail").isEmail(),
    body("password", "Please write your password").notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    user.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ errors: [{ msg: "Please register before" }] });
      }
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (err) {
          throw err;
        } else if (!isMatch) {
          return res.json({ errors: [{ msg: "Wrong Password" }] });
        } else {
          let payload = {
            userId: user._id,
          };
          jwt.sign(payload, process.env.SECRET_KEY, (err, token) => {
            if (err) {
              return res.status(400).json({ errors: [{ msg: "erreur" }] });
            }
            res.send({ token });
          });
        }
      });
    });
  }
);

module.exports = router;
