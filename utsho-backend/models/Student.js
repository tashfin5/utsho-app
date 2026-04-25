const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  rollNumber: String,
  className: String,
  phone: String,
  userId: String   // ✅ THIS MUST EXIST
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);