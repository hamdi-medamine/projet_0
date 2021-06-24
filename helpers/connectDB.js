const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/.env" });
const connectDB = () => {
  mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err) => {
      if (err) {
        throw err;
      }
      console.log("database connected ..");
    }
  );
};

module.exports = connectDB;
