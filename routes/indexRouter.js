const express = require("express");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const multer = require("multer");
const data = require("../src/data");
const { isLoggedIn } = require("../middleware/middleware");

const indexRouter = express();

//get posts for home page
indexRouter.get("/", isLoggedIn, async (req, res) => {
  const username = req.query.user;
  const user = req.user;
  try {
    const posts = await Post.find();
    res.render("home", { posts, user });
  } catch (err) {
    res.status(500).json(err);
  }
});

indexRouter.get("/contact", isLoggedIn, (req, res) => {
  const user = req.user;
  res.render("pages/contact", { user });
});

indexRouter.get("/about", isLoggedIn, (req, res) => {
  const user = req.user;
  res.render("pages/about", { user });
});

module.exports = indexRouter;
