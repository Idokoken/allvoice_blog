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
      req.flash("info", "Category successfully created");
      res.redirect("/post/admin");
    } catch (err) {
      //res.status(500).json(err);
      res.redirect("/category/create");
    }
  });

// edit category
categoryRouter.get("/edit/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.render("category/edit", { category });
    console.log(category);
    res.json(category);
  } catch (error) {
    res.status(500).json(error);
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
  //const { name } = req.body;
  Category.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true },
    (err, data) => {
      if (err) {
        res.status(500).json(err);
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
