const mongoose = require("mongoose");

const { Schema } = mongoose;
const postSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    cover: { type: String },
    categories: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
