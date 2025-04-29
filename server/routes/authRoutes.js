const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();
const SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registered successfully",
      userId: user._id,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
      user: {
        name: user.name,
        email: user.email,
        testStatus: user.testStatus, // passed, score, lastAttempt, cheating
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error during login" });
  }
});

module.exports = router;
