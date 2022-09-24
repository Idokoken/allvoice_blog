const express = require("express");
const User = require("../models/userModel");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const authRouter = express.Router();

//var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");
//var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");
//CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString()

//register
authRouter
  .route("/register")
  .get((req, res) => {
    res.render("pages/register", { layout: false });
  })
  .post(async (req, res) => {
    const { username, email, password } = req.body;

    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt);
    // Store hash in your password DB.

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    try {
      const user = await newUser.save();
      res.redirect("/auth/login");
      console.log(newUser);
    } catch (error) {
      res.status(500).json(error);
    }
  });

// userSchema.methods.createJWT = function () {
//   return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_LIFETIME,
//   });
// };

//login
authRouter
  .route("/login")
  .get((req, res) => {
    res.render("pages/login", { layout: false });
  })
  .post(async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      !user && res.status(401).json("invalid cridentials");

      const userPassword = await bcrypt.compare(password, user.password);

      !userPassword && res.status(401).json("invalid cridentials");

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      );

      res.status(200).json({ user, token });
    } catch (error) {
      res.status(500).json(error);
    }
  });

authRouter.post("/logout", (req, res) => {
  req.logout();
  // req.session.destroy()
  res.redirect("/");
});

module.exports = authRouter;
