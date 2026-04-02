const router = require("express").Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

// Create Post
router.post("/posts", auth, async (req, res) => {
  const post = new Post({
    ...req.body,
    userId: req.userId,
  });
  await post.save();
  res.json(post);
});

// Get Feed
router.get("/posts", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// Like Post
router.put("/posts/like/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json("Post not found");

  if (!post.likes.includes(req.userId)) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter(id => id !== req.userId);
  }

  await post.save();
  res.json(post);
});

// Comment
router.post("/posts/comment/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json("Post not found");

  post.comments.push({
    userId: req.userId,
    text: req.body.text,
  });

  await post.save();
  res.json(post);
});

// Aliases for simpler frontend calls
router.put("/like/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json("Post not found");

  if (!post.likes.includes(req.userId)) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter(id => id !== req.userId);
  }

  await post.save();
  res.json(post);
});

router.post("/comment/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json("Post not found");

  post.comments.push({
    userId: req.userId,
    text: req.body.text,
  });

  await post.save();
  res.json(post);
});

module.exports = router;
