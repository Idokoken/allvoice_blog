const express = require("express");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Category = require("../models/categoryModel");
const { upload } = require("../src/uploadsCloudinary");

const postRouter = express();

//get all post for posts page
postRouter.get("/", async (req, res) => {
  const username = req.query.user;
  const cat = req.query.cat;
  try {
    let posts;

    if (username) {
      posts = await Post.find({ username });
    } else if (cat) {
      posts = await Post.find({ category: { $in: [cat] } });
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

//create post
postRouter
  .route("/create")
  .get(async (req, res) => {
    try {
      const category = await Category.find();
      res.render("posts/add", { category });
    } catch (error) {
      res.status(500).json(error);
    }
  })
  .post(upload.single("cover"), async (req, res) => {
    const { title, description, author, category } = req.body;

    //console.log({ title, description, author, category, cover });

    try {
      if (!title || !description || !req.file) {
        req.flash("error", "All compulsory fields are required");
        res.redirect("/post/create");
      }
      const cover = req.file.path;
      console.log({ title, description, author, category, cover });
      const newPost = new Post({ title, description, author, category, cover });
      const post = await newPost.save();
      req.flash("info", "Post successfully created");
      res.redirect("/post/admin");
    } catch (err) {
      res.status(500).json(err);
    }
  });

//get single post
postRouter.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const author = await User.findOne({ username: post.author });
    res.render("singlepost", { post });
  } catch (err) {
    res.status(500).json(err);
  }
});

//update call
postRouter
  .route("/update/:id")
  .get(async (req, res) => {
    try {
      const category = await Category.find();
      const post = await Post.findById(req.params.id);
      res.render("posts/edit", { post, category });
    } catch (error) {
      res.status(500).json({ error });
    }
  })
  .post(upload.single("cover"), async (req, res) => {
    const { title, description, author, categories } = req.body;
    try {
      if (!title || !description || !req.file) {
        req.flash("error", "All compulsory fields are required");
        res.redirect("/post/update/" + req.params.id);
      }
      const cover = req.file.path;
      //console.log({ title, description, author, category, cover });
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
