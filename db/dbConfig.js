const mongoose = require("mongoose");
require("dotenv").config();

module.exports = function () {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Mongodb Connected Successfully");
    })
    .catch(() => {
      console.log("Something want to wrong while Database Connection");
    });
};
