const express = require("express");
const User = require("../models/userModel");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

//var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");
//var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");

//register
authRouter
  .route("/register")
  .post(async (req, res) => {
    const { username, email, password } = req.body;

    const newUser = new User({
      username,
      email,
      password: CryptoJS.AES.encrypt(password, keys.PASS_SEC).toString(),
    });
    try {
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  })
  .get((req, res) => {
    res.status(200).send("register page");
  });

//login
authRouter
  .route("/login")
  .post(async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      !user && res.status(401).json("invalid cridentials");
      const userPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC
      ).toString(CryptoJS.enc.Utf8);

      userPassword !== password && res.status(401).json("invalid cridentials");

      // const token = jwt.sign(
      //   { id: user._id, isAdmin: user.isAdmin },
      //   keys.JWT_SECRET,
      //   { expiresIn: "3d" }
      // );

      //const{password, ...others} = user._doc

      res.status(200).json({ user, token });
    } catch (error) {
      res.status(500).json(error);
    }
  })
  .get((req, res) => {
    res.status(200).send("login page");
  });

module.exports = authRouter;
