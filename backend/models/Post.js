const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: String,
  username: String,
  text: { type: String, default: "" },
  image: { type: String, default: "" },
  likes: [
    {
      userId: String,
      username: String,
    },
  ],
  comments: [
    {
      userId: String,
      username: String,
      text: String,
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
