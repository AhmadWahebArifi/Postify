const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const postsRoutes = require("./routes/posts");

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.json({ message: "Postify API running" });
});

app.use("/", authRoutes);
app.use("/", postsRoutes);

app.listen(5000, () => console.log("Server running"));
