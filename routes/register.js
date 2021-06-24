const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./config/.env" });
// register user
router.post(
  "/",
  [
    body("firstname", "Firstname must contain only alphabetique").isAlpha(),
    body("lastname", "Lastname must contain only alphabetique").isAlpha(),
    body("gender", "Gender can be male or female").isAlpha(),
    body("age", "Age must be a number").isNumeric(),
    body("email", "Please enter a valid e-mail").isEmail(),
    body("password", "Minimum length allowed is 5 character").isLength({
      min: 5,
    }),
    body("phonenumber", "Phonenumber must contain only number").isNumeric(),
    body("location", "Please enter your current adress").isAlpha(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(req.body);
      return res.status(400).json({ errors: errors.array() });
    }

    user.find({ email: req.body.email }).then((users) => {
      if (users.length) {
        return res
          .status(400)
          .send({ errors: [{ msg: "User already exists !" }] });
      }

      let newUser = new user(req.body);
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          throw err;
        }
        bcrypt.hash(req.body.password, salt, (err, hashedPwd) => {
          if (err) {
            console.log(err);
          }
          newUser.password = hashedPwd;

          newUser.save();

          let payload = {
            userId: newUser._id,
          };

          jwt.sign(payload, process.env.SECRET_KEY, (err, token) => {
            if (err) {
              console.log(err);
            }
            res.send({ token });
          });
        });
      });
    });
  }
);

module.exports = router;
