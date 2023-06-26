const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = (req, res) => {
  User.find({ email: req.body.email })
    .then((user) => {
      if (user.length >= 1) {
        res.status(409).json({
          message: "Already Have an Account using this email",
        });
      } else {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
          console.log(hash);
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              userName: req.body.userName,
              email: req.body.email,
              password: hash,
            });

            await user.save().then((result) => {
              console.log(result);

              res.status(201).json({
                message: "User Created Successfully",
              });
            });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);

      res.status(400).json({
        error: err,
      });
    });
};

const login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      console.log(user);
      if (user.length < 1) {
        console.log("user.length : ", user.length);
        res.status(400).json({
          message: "Auth Fail",
        });
      } else {
        console.log(req.body.password);
        console.log(user.password);
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            res.status(401).json({
              message: "Auth Fail",
            });
          } else {
            if (result) {
              const token = jwt.sign(
                {
                  email: user.email,
                  password: user.password,
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "1h",
                }
              );
              console.log("token", token);
              res.cookie("token", token, { httpOnly: true }).send();
            } else {
              res.status(400).json({
                message: "Auth Failed",
              });
            }
          }
        });
      }
    })
    .catch((err) => {
      return res.status(400).send();
    });
};

const logout = (req, res) => {
  try {
    res.clearCookie("token");
    console.log("Clear Cookie");
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
};
