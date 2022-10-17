const express = require("express");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const multer = require("multer");
const data = require("../src/data");

const indexRouter = express();

//get posts for home page
indexRouter.get("/", async (req, res) => {
  const username = req.query.user;

  try {
    const posts = await Post.find();
    res.render("home", { posts });
  } catch (err) {
    res.status(500).json(err);
  }
});

indexRouter.get("/contact", (req, res) => {
  res.render("pages/contact");
});

indexRouter.get("/about", (req, res) => {
  res.render("pages/about");
});

module.exports = indexRouter;
