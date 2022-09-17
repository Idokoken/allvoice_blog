const express = require("express");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Category = require("../models/categoryModel");
const { upload } = require("../src/uploadsCloudinary");

const postRouter = express();

//get all post for posts page
postRouter.get("/", async (req, res) => {
  const username = req.query.category;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else {
      posts = await Post.find();
    }
    res.render("posts", { posts });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all post for admin page
postRouter.get("/admin", async (req, res) => {
  try {
    const category = await Category.find();
    const posts = await Post.find();
    res.render("posts/index", { posts, category });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get single post
postRouter.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render("singlepost", { post });
  } catch (err) {
    res.status(500).json(err);
  }
});

//create post
postRouter
  .route("/create")
  .get((req, res) => {
    res.render("post/add");
  })
  .post(upload.single("cover"), async (req, res) => {
    const { title, description, author, categories } = req.body;
    const cover = req.file.path;
    const newPost = new Post({ title, description, author, categories, cover });

    try {
      const post = await newPost.save();
      req.flash("success", "Post successfully created");
      res.redirect("/post/admin");
    } catch (err) {
      // res.status(500).json(err);
      res.redirect("/post/create");
    }
  });

//update call
postRouter
  .route("/update/:id")
  .get(async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post/edit", { post });
    } catch (error) {
      res.status(500).json({ error });
    }
  })
  .post(upload.single("cover"), async (req, res) => {
    const { title, description, author, categories } = req.body;
    const cover = req.file.path;
    //const newPost = new Post({title, description, author, categories, cover});
    try {
      await Post.findByIdAndUpdate(
        req.params.id,
        { title, description, author, categories, cover },
        { new: true }
      );
      req.flash("info", "category successfully updated");
      res.redirect("/post/admin");
    } catch (error) {
      res.status(500).json(error);
      //res.redirect("/category/create");
    }
  });

//delete call
postRouter.get("/delete/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.delete();

    req.flash("info", "category successfully deleted");
    res.redirect("/post/admin");
  } catch (err) {
    //res.status(500).json(err);
    res.redirect("/category/create");
  }
});

module.exports = postRouter;
