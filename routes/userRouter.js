const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { verifyToken, verifyTokenAndAdmin } = require("./verifyToken");

const userRouter = express.Router();

userRouter.post("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json("error updating user");
  }
});
// delete call
userRouter.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("user deleted");
  } catch (err) {
    res.status(500).json("error updating user");
  }
});

//get call
userRouter.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json("you are not an admin");
  }
});

//get all
userRouter.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json("you are not an admin");
  }
});

module.exports = userRouter;
