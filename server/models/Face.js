const mongoose = require("mongoose");

const FaceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,  // Ensures one face record per user
    index: true,   // Create an index for efficient queries
  },
  image: {
    type: String, 
    required: true,
    validate: {
      validator: function (v) {
        // Simple check for base64 encoded image (optional, can be customized)
        return /^data:image\/\w+;base64,/.test(v);
      },
      message: "Invalid image format. Make sure it's base64 encoded.",
    },
  },
}, { timestamps: true });  // Automatically add timestamps for createdAt and updatedAt

module.exports = mongoose.model("Face", FaceSchema);
