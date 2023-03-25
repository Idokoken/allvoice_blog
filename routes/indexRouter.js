const express = require("express");
const Post = require("../models/postModel");
const { isLoggedIn } = require("../middleware/middleware");
const ContactUs = require("../models/ContactUsModel");
const Data = require("../src/data");

const indexRouter = express();

//get posts for home page
indexRouter.get("/", isLoggedIn, async (req, res) => {
  const username = req.query.user;

  try {
    const posts = await Post.find().limit(4).sort({ createdAt: -1 });
    const featuredPost = await Post.find({ isFeatured: true }).limit(2);
    const user = req.user;
    res.render("pages/home", { posts, featuredPost, user });
  } catch (err) {
    res.status(500).json(err);
  }
});

indexRouter
  .route("/contact")
  .get(isLoggedIn, (req, res) => {
    const user = req.user;
    res.render("pages/contact", { user });
  })
  .post(isLoggedIn, async (req, res) => {
    try {
      const newMessage = await new ContactUs(req.body);
      await newMessage.save();
      res.redirect("/contact", { successMsg: "message successfully sent" });
    } catch (error) {
      res.status(500).json(error);
    }
  });

indexRouter.get("/about", isLoggedIn, (req, res) => {
  const user = req.user;
  res.render("pages/about", { user });
});

module.exports = indexRouter;
