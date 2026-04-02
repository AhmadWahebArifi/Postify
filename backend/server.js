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

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // In production, allow your specific frontend domain
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins = [
        'https://postify-171qw35bm-ahmad-arifis-projects.vercel.app',
        process.env.FRONTEND_URL
      ].filter(Boolean);
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        console.log('Allowed origins:', allowedOrigins);
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // In development, allow all origins
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

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
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 10s
    bufferMaxEntries: 0, // Disable mongoose buffering
    bufferCommands: false, // Disable mongoose buffering
  })
  .then(() => {
    console.log("✅ DB connected successfully");
    console.log("MongoDB URI:", mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
    console.error("Please check your MongoDB URI in environment variables");
    // Don't exit the process, let the app run with limited functionality
  });

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

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
