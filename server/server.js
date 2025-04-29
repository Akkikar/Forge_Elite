const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes.js");
const testRoutes = require("./routes/testRoutes.js");
const user=require("./routes/user.js");

const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
  }));

app.use("/api/tests", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user",user);


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(8000, () => console.log("✅ Server running on port 8000"));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

