const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const auth = require("../middleware/auth");

// Create Post
router.post("/posts", auth, async (req, res) => {
  try {
    const text = typeof req.body.text === "string" ? req.body.text : "";
    const image = typeof req.body.image === "string" ? req.body.image : "";

    console.log('POST /posts - Creating post');
    console.log('Text length:', text.length);
    console.log('Has image:', !!image);
    console.log('Image length:', image ? image.length : 0);

    if (!text.trim() && !image.trim()) {
      return res.status(400).json("Post must contain text or image");
    }

    let user;
    if (req.userId === 'mock-user-id') {
      // Handle mock user for demo mode
      user = { username: 'Demo User' };
    } else {
      user = await User.findById(req.userId);
      if (!user) return res.status(401).json("User not found");
    }

    const post = new Post({
      userId: req.userId,
      username: user.username,
      text,
      image,
      likes: [],
      comments: [],
    });

    await post.save();
    console.log('Post saved to MongoDB with ID:', post._id);
    console.log('Post has image:', !!post.image);
    res.json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({
      message: "Server error",
      error: err?.message || String(err),
    });
  }
});

// Get Feed
router.get("/posts", async (req, res) => {
  try {
    console.log('GET /posts - Fetching all posts');
    const posts = await Post.find().sort({ createdAt: -1 });
    console.log(`Found ${posts.length} posts`);
    
    // Log image info for each post
    posts.forEach((post, index) => {
      console.log(`Post ${index + 1}: Has image: ${!!post.image}, Image length: ${post.image ? post.image.length : 0}`);
    });
    
    res.json(posts);
  } catch (err) {
    console.error('Get posts error:', err);
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
