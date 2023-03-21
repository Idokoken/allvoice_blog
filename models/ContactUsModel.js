const mongoose = require("mongoose");

const { Schema } = mongoose;
const contactUsModel = new Schema(
  {
    name: { type: String },
    email: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactUs", contactUsModel);
