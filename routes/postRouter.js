const express = require("express");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const multer = require("multer");
const data = require("../src/data");

const postRouter = express();

//get all post for posts page
postRouter.get("/home", async (req, res) => {
  const username = req.query.category;
  try {
    let posts;

    if (username) {
      posts = await Post.find({ username });
    } else {
      posts = await Post.find();
    }
    res.render("posts", { posts: data });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all post for admin page
postRouter.get("/admin", async (req, res) => {
  try {
    posts = await Post.find();
    res.render("admin/index", { posts: data });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get single post
postRouter.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render("singlepost");
  } catch (err) {
    res.status(500).json(err);
  }
});

//create post
postRouter.get("/add", async (req, res) => {
  try {
    posts = await Post.find();
    res.render("admin/add", { posts: data });
  } catch (err) {
    res.status(500).json(err);
  }
});
// postRouter.get("/create", (req, res) => {
//   //res.render("pages/about");
//   console.log("hello");
// });
postRouter.post("/create", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const post = await newPost.save();
    res.status(200).json(post);
    //res.redirect('/post/admin')
  } catch (err) {
    res.status(500).json(err);
  }
});

//update call
postRouter.post("/update/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedUser = await Post.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("you can only update your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete call
postRouter.get("/delete/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.delete();
    res.status(200).json("post successfully deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = postRouter;
