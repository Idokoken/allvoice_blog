const express = require("express");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const multer = require("multer");
const data = require("../src/data");

const indexRouter = express();

//get post for home page
indexRouter.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;

    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({ categories: { $in: [catName] } });
    } else {
      posts = await Post.find();
    }

    res.render("home", { posts: data });
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
