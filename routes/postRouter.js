const express = require("express");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Category = require("../models/categoryModel");
const { upload } = require("../src/uploadsCloudinary");
const { isLoggedIn } = require("../middleware/middleware");
const Data = require("../src/data");

const postRouter = express();

//get all post for posts page
postRouter.get("/", isLoggedIn, async (req, res) => {
  try {
    let posts = await Post.find().sort({ createdAt: -1 });
    const user = req.user;
    res.render("pages/posts", { posts, user });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all post for admin page
postRouter.get("/admin", isLoggedIn, async (req, res) => {
  try {
    const category = await Category.find();
    const posts = await Post.find();
    const user = req.user;
    console.log(user.isAdmin);
    if (user.isAdmin) {
      res.render("admin/index", { posts, category, user });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    res.redirect("/");
  }
});

//create post
postRouter
  .route("/create")
  .get(isLoggedIn, async (req, res) => {
    try {
      const user = req.user;
      const category = await Category.find();
      res.render("admin/posts/add", { category, user });
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
postRouter.get("/:id", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const post = await Post.findById(req.params.id);
    const posts = await Post.find().limit(3);
    res.render("pages/singlepost", { post, posts, user });
  } catch (err) {
    res.status(500).json(err);
  }
});

//update call
postRouter
  .route("/update/:id")
  .get(isLoggedIn, async (req, res) => {
    const user = req.user;
    try {
      const category = await Category.find();
      const post = await Post.findById(req.params.id);
      res.render("admin/posts/edit", { post, category, user });
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
