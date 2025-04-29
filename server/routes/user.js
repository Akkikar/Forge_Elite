const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Face = require("../models/Face");
const UserAnswers = require("../models/UserAnswers");
const authMiddleware = require("../utils/auth");

const JWT_SECRET = process.env.JWT_SECRET;


router.post("/upload-face", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    const existing = await Face.findOne({ user: userId });
    if (existing) {
      existing.image = image;
      await existing.save();
    } else {
      await Face.create({ user: userId, image });
    }

    res.json({ success: true, message: "Selfie saved to DB." });
  } catch (err) {
    console.error("Upload face error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

// 📷 Check if selfie exists
router.get("/selfie-exists", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const selfie = await Face.findOne({ user: userId });
    res.json({ exists: !!selfie });
  } catch (err) {
    console.error("Selfie check error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

router.get("/status", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    

    if (!user || !user.testStatus) {
      return res.status(404).json({ message: "User or test status not found" });
    }

    const { passed, score, lastAttempt } = user.testStatus;
    const topicPercentages = user.topicPercentages;
    const references = user.references;
    const name=user.name;

    res.json({
      name,
      passed,
      score,
      lastAttempt: lastAttempt || null,
      topicPercentages,
      references,
    });
  } catch (err) {
    console.error("❌ Failed to fetch status:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// 🖼️ Get user's selfie image
router.get("/get-selfie", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const selfie = await Face.findOne({ user: userId });
    if (!selfie) return res.status(404).json({ error: "Selfie not found" });

    res.json({ image: selfie.image });
  } catch (err) {
    console.error("Get selfie error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;
