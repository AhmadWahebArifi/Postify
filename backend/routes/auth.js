const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json("Missing fields");

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json("Email already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashed,
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json("Server error");
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json("Missing fields");

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json("Wrong password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json("Server error");
  }
});

module.exports = router;
