const express = require("express");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const { isLoggedIn } = require("../middleware/middleware");

const categoryRouter = express.Router();

categoryRouter
  .route("/create")
  .get(isLoggedIn, (req, res) => {
    const user = req.user;
    res.render("admin/category/add", { user });
  })
  .post(async (req, res) => {
    const { name } = req.body;
    try {
      if (!name) {
        req.flash("error", "category name is required");
        return res.redirect("/category/create");
      }
      const newCategory = new Category({ name });
      const category = await newCategory.save();
      req.flash("info", "Category successfully created");
      res.redirect("/post/admin");
    } catch (err) {
      req.flash("error", "error creating category");
      return res.redirect("/category/create");
    }
  });

// edit category
categoryRouter.get("/edit/:id", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const category = await Category.findById(req.params.id);
    res.render("admin/category/edit", { category, user });
  } catch (error) {
    req.flash("error", "error updating category");
    return res.redirect("/category/create");
  }
});

/*
categoryRouter.post("/edit/:id", async (req, res) => {
  const { id } = req.params.id;
  const { name } = req.body;
  try {
    await Category.findByIdAndUpdate(id, { name });
    //req.flash("info", "category successfully updated");
    //res.redirect("/post/admin");
  } catch (error) {
    res.status(500).json(error);
    //res.redirect("/category/create");
  }
});
*/
categoryRouter.post("/edit/:id", (req, res) => {
  const { name } = req.body;
  if (!name) {
    req.flash("error", "category name is required");
    return res.redirect("/category/edit/" + req.params.id);
  }
  Category.findByIdAndUpdate(
    req.params.id,
    { $set: { name } },
    { new: true },
    (err, data) => {
      if (err) {
        req.flash("error", "error updating category");
        return res.redirect("/category/edit/" + req.params.id);
      } else {
        req.flash("info", "Category successfully updated");
        res.redirect("/post/admin");

        console.log(data);
      }
    }
  );
});

// delete category
categoryRouter.get("/delete/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    req.flash("error", "category successfully deleted");
    res.redirect("/post/admin");
  } catch (error) {
    res.redirect("/post/admin");
  }
});

module.exports = categoryRouter;
