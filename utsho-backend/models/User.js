const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  password: String, // plain for now
  role: {
    type: String,
    enum: ["admin", "teacher", "student"],
    required: true
  },
  userId: {
    type: String,
    unique: true,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);