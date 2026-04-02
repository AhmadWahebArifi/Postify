const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res) => {
  try {
    console.log('POST /register - Registration request');
    const { username, email, password } = req.body;

    console.log('Registration data:', { username, email, passwordLength: password?.length });

    if (!username || !email || !password) {
      console.log('Missing fields in registration');
      return res.status(400).json("Missing fields");
    }

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Email already exists:', email);
      return res.status(400).json("Email already exists");
    }

    console.log('Creating new user...');
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashed,
    });
    await user.save();

    console.log('User created successfully:', { id: user._id, username: user.username, email: user.email });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "30d",
    });
    
    console.log('JWT token generated for new user');
    res.json({ token, userId: user._id, username: user.username });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      message: "Server error",
      error: err?.message || String(err),
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    console.log('POST /login - Login request');
    const { email, password } = req.body;

    console.log('Login data:', { email, passwordLength: password?.length });

    if (!email || !password) {
      console.log('Missing fields in login');
      return res.status(400).json("Missing fields");
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json("User not found");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log('Wrong password for:', email);
      return res.status(400).json("Wrong password");
    }

    console.log('Login successful for:', { id: user._id, username: user.username, email: user.email });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "30d",
    });
    
    console.log('JWT token generated for login');
    res.json({ token, userId: user._id, username: user.username });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      message: "Server error",
      error: err?.message || String(err),
    });
  }
});

module.exports = router;
