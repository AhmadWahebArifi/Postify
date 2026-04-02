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
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB not connected, returning fallback posts');
      return res.json([
        {
          _id: 'fallback-1',
          userId: 'fallback-user',
          username: 'Demo User',
          text: 'Welcome to Postify! This is a demo post since the database is currently unavailable.',
          image: '',
          likes: [],
          comments: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    }
    
    const posts = await Post.find().sort({ createdAt: -1 });
    console.log(`Found ${posts.length} posts`);
    
    // Log image info for each post
    posts.forEach((post, index) => {
      console.log(`Post ${index + 1}: Has image: ${!!post.image}, Image length: ${post.image ? post.image.length : 0}`);
    });
    
    res.json(posts);
  } catch (err) {
    console.error('Get posts error:', err);
    
    // Return fallback posts on error
    res.json([
      {
        _id: 'fallback-1',
        userId: 'fallback-user',
        username: 'Demo User',
        text: 'Welcome to Postify! This is a demo post since the database is currently unavailable.',
        image: '',
        likes: [],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  }
});

// Like Post
router.put("/like/:id", auth, async (req, res) => {
  try {
    console.log('PUT /like/:id - Liking post:', req.params.id);
    console.log('User ID:', req.userId);
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");

    console.log('Current likes count:', post.likes?.length || 0);
    console.log('Current likes:', post.likes);

    let user;
    if (req.userId === 'mock-user-id') {
      // Handle mock user for demo mode
      user = { username: 'Demo User' };
    } else {
      user = await User.findById(req.userId);
      if (!user) return res.status(401).json("User not found");
    }

    const likeIndex = (post.likes || []).findIndex((l) => l.userId === req.userId);
    console.log('Like index for user:', likeIndex);
    
    if (likeIndex === -1) {
      // User hasn't liked yet, add like
      post.likes.push({ userId: req.userId, username: user.username });
      console.log('Post liked by:', user.username);
    } else {
      // User already liked, remove like (unlike)
      post.likes.splice(likeIndex, 1);
      console.log('Post unliked by:', user.username);
    }

    console.log('New likes count:', post.likes?.length || 0);
    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Like post error:', err);
    res.status(500).json({
      message: "Server error",
      error: err?.message || String(err),
    });
  }
});

// Comment
router.post("/comment/:id", auth, async (req, res) => {
  try {
    console.log('POST /comment/:id - Commenting on post:', req.params.id);
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");

    let user;
    if (req.userId === 'mock-user-id') {
      // Handle mock user for demo mode
      user = { username: 'Demo User' };
    } else {
      user = await User.findById(req.userId);
      if (!user) return res.status(401).json("User not found");
    }

    const text = typeof req.body.text === "string" ? req.body.text : "";
    if (!text.trim()) return res.status(400).json("Comment text is required");

    post.comments.push({
      userId: req.userId,
      username: user.username,
      text,
      createdAt: new Date()
    });

    console.log('Comment added by:', user.username, '- Text:', text);

    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Comment error:', err);
    res.status(500).json({
      message: "Server error",
      error: err?.message || String(err),
    });
  }
});

// Get Comments for Post
router.get("/comments/:id", async (req, res) => {
  try {
    console.log('GET /comments/:id - Fetching comments for post:', req.params.id);
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");

    console.log(`Found ${post.comments?.length || 0} comments`);
    res.json(post.comments || []);
  } catch (err) {
    console.error('Get comments error:', err);
    res.status(500).json({
      message: "Server error",
      error: err?.message || String(err),
    });
  }
});

// Delete Comment
router.delete("/comment/:postId/:commentIndex", auth, async (req, res) => {
  try {
    console.log('DELETE /comment/:postId/:commentIndex - Deleting comment:', req.params.postId, req.params.commentIndex);
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json("Post not found");

    const commentIndex = parseInt(req.params.commentIndex);
    if (isNaN(commentIndex) || commentIndex < 0 || commentIndex >= post.comments.length) {
      return res.status(400).json("Invalid comment index");
    }

    const comment = post.comments[commentIndex];
    
    // Check if user is the comment author or post author
    let user;
    if (req.userId === 'mock-user-id') {
      user = { username: 'Demo User' };
    } else {
      user = await User.findById(req.userId);
      if (!user) return res.status(401).json("User not found");
    }

    if (comment.userId !== req.userId && post.userId !== req.userId) {
      return res.status(403).json("Not authorized to delete this comment");
    }

    post.comments.splice(commentIndex, 1);
    await post.save();
    
    console.log('Comment deleted by:', user.username);
    res.json(post);
  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json({
      message: "Server error",
      error: err?.message || String(err),
    });
  }
});

// Aliases for simpler frontend calls - Remove duplicates since we already have the routes above

module.exports = router;
