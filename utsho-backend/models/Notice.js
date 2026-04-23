const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: "General" },
  author: { type: String, default: "Admin" }
}, { timestamps: true });

module.exports = mongoose.model("Notice", noticeSchema);