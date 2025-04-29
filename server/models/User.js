const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // For password hashing

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    testStatus: {
      passed: { type: Boolean, default: false },
      score: { type: Number, default: 0 },
      lastAttempt: { type: Date },
      cheating: { type: Boolean, default: false },
    },
    topicPercentages: {
      DSA: { type: String, default: "0.00" },
      DBMS: { type: String, default: "0.00" },
      OS: { type: String, default: "0.00" },
      CN: { type: String, default: "0.00" },
    },
    references: [
      {
        topic: { type: String },
        link: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
