const express = require("express");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(async (req, res) => {
    try {
      const category = await Category.find();
      res.status(200).json(category);
    } catch (err) {
      res.status(500).json(err);
    }
  })
  .post(async (req, res) => {
    const newCategory = new Category(req.body);
    try {
      const category = await newCategory.save();
      res.status(200).json(category);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = categoryRouter;
