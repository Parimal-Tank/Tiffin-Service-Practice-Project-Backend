const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const signup = (req, res) => {
  console.log(req.body);
  User.find({ email: req.body.email })
    .then(async (user) => {
      if (user.length >= 1) {
        res.status(409).json({
          message: "Already Have an Account using this email",
        });
      } else {
        const token = jwt.sign(
          {
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );

        const user = new User({
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
          token: token,
        });

        await user.save().then((result) => {
          if (result) {
            console.log("result: ", result);
            // For sending mail to Users
            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "parimaltank132@gmail.com",
                pass: "qorlqlshjnfdleoy",
              },
            });

            const url = `http://localhost:3000/auth/${token}`;

            const mailOptions = {
              from: "parimaltank132@gmail.com",
              to: user.email,
              subject: "Welcome To Tiffin Service",
              html: `<h3>URL for account verification is </h3>
                 <a href=${url}>  
                    <button>Click Me</button>
                 </a>
                `, // html body
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });

            res.status(201).json({
              message: "User Created Successfully",
            });
          } else {
            res.status(400).json({
              message: "Auth Failed",
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
              res.status(200).json({
                token,
              });
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

const verification = (req, res) => {
  const token = req.body;
  console.log("token: ", token);

  if (token) {
    res.status(201).json({
      message: "User Verified Successfully",
    });
  } else {
    res.status(403).json({
      message: "Verification Fail",
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  verification,
};
