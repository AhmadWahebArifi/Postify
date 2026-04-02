const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: String,
  text: String,
  image: String,
  likes: [String],
  comments: [
    {
      userId: String,
      text: String,
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
