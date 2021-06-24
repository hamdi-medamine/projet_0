const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  gender: String,
  age: Number,
  email: String,
  password: String,
  phonenumber: Number,
  location: String,
});

module.exports = mongoose.model("user", userSchema);
