const express = require("express");
const app = express();
const DatabaseConnect = require("./db/dbConfig");
const userRoute = require("./routes/userRoute");
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/user", userRoute);

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.listen(3001, function () {
  console.log("Server Started.....3001");
});

DatabaseConnect();
