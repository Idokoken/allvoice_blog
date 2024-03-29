const express = require("express");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { isLoggedIn } = require("../middleware/middleware");

const authRouter = express.Router();

//register
authRouter
  .route("/register")
  .get((req, res) => {
    res.render("pages/register", { layout: "layouts/register" });
  })
  .post(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      req.flash("error", "All fields must be filled");
      res.render("pages/register", {
        layout: "layouts/register",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "email already in use");
      res.render("pages/register", {
        layout: "layouts/register",
      });
    }

    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(password, salt);
    // Store hash in your password DB.

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    try {
      const user = await newUser.save();
      res.redirect(200, "/auth/login");
      console.log(user);
    } catch (error) {
      req.flash("error", "error creating user");
      res.render("pages/register", {
        layout: "layouts/register",
      });
    }
  });

//login
authRouter
  .route("/login")
  .get((req, res) => {
    res.render("pages/login", { layout: "layouts/register" });
  })
  .post(async (req, res) => {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        req.flash("error", "all fields are required");
        return res.render("pages/login", {
          layout: "layouts/register",
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        req.flash("error", "invalid cridentials");
        return res.render("pages/login", { layout: "layouts/register" });
      }

      const userPassword = await bcrypt.compare(password, user.password);
      if (!userPassword) {
        req.flash("error", "invalid cridentials");
        return res.render("pages/login", { layout: "layouts/register" });
      }

      const token = await jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      console.log("token is " + token);

      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };
      res.cookie("jwt", token, cookieOptions);
      // res.status(200).json({ user, token });
      return res.redirect("/");
    } catch (error) {
      req.flash("error", "error logining user");
      return res.render("pages/login", { layout: "layouts/register" });
    }
  });

authRouter.get("/logout", async (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
  res.status(200).redirect("/");
});

module.exports = authRouter;
