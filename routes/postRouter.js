// JavaScript Document
const express = require("express");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const multer = require("multer");

const postRouter = express();

//get all post
postRouter.get("/", async (req, res) => {
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

    res.render("home", { posts });
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
postRouter.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const post = await newPost.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update call
postRouter.put("/:id", async (req, res) => {
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
postRouter.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json("post successfully deleted");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("you can only delete your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = postRouter;
