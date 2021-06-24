const mongoose = require("mongoose");
const citySchema = mongoose.Schema({
  cityname: String,
  poster: String,
  descriptions: String,
});

module.exports = mongoose.model("city", citySchema);
