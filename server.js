const express = require("express");
const connectDB = require("./helpers/connectDB");
const app = express();

// connect to db
connectDB();

// middlewares
app.use(express.json());

// define routes
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/post", require("./routes/post"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is running on PORT : ${PORT}`));
