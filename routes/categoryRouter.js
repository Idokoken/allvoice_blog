const express = require("express");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");

const categoryRouter = express.Router();

categoryRouter
  .route("/create")
  .get((req, res) => {
    res.render("category/add");
  })
  .post(async (req, res) => {
    const newCategory = new Category(req.body);
    try {
      const category = await newCategory.save();
      req.flash("success", "Category successfully created");
      res.redirect("/post/admin");
    } catch (err) {
      //res.status(500).json(err);
      res.redirect("/category/create");
    }
  });

// edit category
categoryRouter
  .route("/edit/:id")
  .get(async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      res.render("category/edit", { category });
    } catch (error) {
      res.status(500).json(error);
    }
  })
  .post(async (req, res) => {
    const { id } = req.params.id;
    try {
      await Category.findByIdAndUpdate(id, { $set: req.body }, { new: true });
      req.flash("info", "category successfully updated");
      res.redirect("/post/admin");
    } catch (error) {
      //res.status(500).json(error);
      res.redirect("/category/create");
    }
  });

// delete category
categoryRouter.get("delete/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    req.flash("info", "category successfully deleted");
    res.redirect("/post/admin");
  } catch (error) {
    res.redirect("/post/admin");
  }
});

module.exports = categoryRouter;
