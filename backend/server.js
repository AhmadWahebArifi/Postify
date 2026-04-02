const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { URL } = require("url");

require("dotenv").config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

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

app.use("/", authRoutes);
app.use("/", postsRoutes);

app.listen(5000, () => console.log("Server running"));
