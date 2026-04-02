const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const auth = require("../middleware/auth");

// Create Post
router.post("/posts", auth, async (req, res) => {
  try {
    const text = typeof req.body.text === "string" ? req.body.text : "";
    const image = typeof req.body.image === "string" ? req.body.image : "";

    if (!text.trim() && !image.trim()) {
      return res.status(400).json("Post must contain text or image");
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json("User not found");

    const post = new Post({
      userId: req.userId,
      username: user.username,
      text,
      image,
      likes: [],
      comments: [],
    });

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err?.message || String(err),
    });
  }
});

// Get Feed
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err?.message || String(err),
    });
  }
});

// Like Post
router.put("/posts/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");

    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json("User not found");

    const likeIndex = (post.likes || []).findIndex((l) => l.userId === req.userId);
    if (likeIndex === -1) {
      post.likes.push({ userId: req.userId, username: user.username });
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err?.message || String(err),
    });
  }
});

// Comment
router.post("/posts/comment/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");

    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json("User not found");

    const text = typeof req.body.text === "string" ? req.body.text : "";
    if (!text.trim()) return res.status(400).json("Comment text is required");

    post.comments.push({
      userId: req.userId,
      username: user.username,
      text,
    });

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err?.message || String(err),
    });
  }
});

// Aliases for simpler frontend calls
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");

    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json("User not found");

    const likeIndex = (post.likes || []).findIndex((l) => l.userId === req.userId);
    if (likeIndex === -1) {
      post.likes.push({ userId: req.userId, username: user.username });
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err?.message || String(err),
    });
  }
});

router.post("/comment/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");

    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json("User not found");

    const text = typeof req.body.text === "string" ? req.body.text : "";
    if (!text.trim()) return res.status(400).json("Comment text is required");

    post.comments.push({
      userId: req.userId,
      username: user.username,
      text,
    });

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err?.message || String(err),
    });
  }
});

module.exports = router;
