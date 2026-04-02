const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { URL } = require("url");

require("dotenv").config({ path: '.env.local' });

// Debug: Check if environment variables are loaded
console.log('Environment check:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('PORT:', process.env.PORT || '5000');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

const app = express();
app.use(cors());

// Fix for Express 5.x - body parser configuration
app.use(express.json({ 
  limit: '50mb', // Increased for images
  type: 'application/json'
}));
app.use(express.urlencoded({ 
  limit: '50mb', 
  extended: true 
}));

const authRoutes = require("./routes/auth");
const postsRoutes = require("./routes/posts");

if (!process.env.MONGODB_URI) {
  console.error("Missing env: MONGODB_URI");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("Missing env: JWT_SECRET");
  process.exit(1);
}

let mongoUri = process.env.MONGODB_URI;
try {
  const parsed = new URL(mongoUri);
  const hasDbName = parsed.pathname && parsed.pathname !== "/";
  if (!hasDbName) {
    parsed.pathname = "/postify";
    mongoUri = parsed.toString();
  }
} catch (err) {
  console.error("Invalid MONGODB_URI:", err?.message || err);
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB connection error:", err));

app.get("/", (req, res) => {
  res.json({ message: "Postify API running" });
});

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get("/test", (req, res) => {
  res.json({ 
    message: "API test successful",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.use("/", authRoutes);
app.use("/", postsRoutes);

// Debug: Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: "Route not found", path: req.path });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
