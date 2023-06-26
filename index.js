const express = require("express");
const app = express();
const DatabaseConnect = require("./db/dbConfig");
const userRoute = require("./routes/userRoute");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", userRoute);

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.listen(3001, function () {
  console.log("Server Started.....3001");
});

DatabaseConnect();
