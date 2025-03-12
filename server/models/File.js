const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  originalName: String,
  storedName: String,
  fileType: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", FileSchema);