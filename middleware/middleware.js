const express = require("express");
const User = require("../models/userModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.isLoggedIn = async (req, res, next) => {
  //console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      //console.log(decoded);

      const result = await User.findById(decoded.id);
      // //console.log(result);
      if (!result) {
        return next();
      }
      req.user = result;
      // console.log("this is user");
      //console.log(req.user);
      return next();
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    next();
  }
};
