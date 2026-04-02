const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { URL } = require("url");
const authRoutes = require("./routes/auth");
const postsRoutes = require("./routes/posts");

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
    const allowedOrigins = [
      'https://postify-wine.vercel.app',
      'https://postify-171qw35bm-ahmad-arifis-projects.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
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

app.use("/", authRoutes);
app.use("/", postsRoutes);

// Debug: Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

if (!process.env.MONGODB_URI) {
  console.error("Missing env: MONGODB_URI");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("Missing env: JWT_SECRET");
  process.exit(1);
}

let mongoUri = process.env.MONGODB_URI?.trim();
try {
  if (mongoUri) {
    const parsed = new URL(mongoUri);
    const hasDbName = parsed.pathname && parsed.pathname !== "/";
    if (!hasDbName) {
      parsed.pathname = "/postify";
      mongoUri = parsed.toString();
    }
  }
} catch (err) {
  console.error("Invalid MONGODB_URI format:", err?.message || err);
}

// Remove unnecessary code

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

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: "Route not found", path: req.path });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  let server;
  try {
    const connectionOptions = {
      serverSelectionTimeoutMS: 15000,
      family: 4,
      bufferCommands: false,
    };

    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(mongoUri, connectionOptions);
    console.log("✅ DB connected successfully");
    
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error("❌ DB connection error:", err);
    console.log("Starting server anyway with limited functionality...");
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT} (DB disconnected)`);
    });
  }

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
};

startServer();
