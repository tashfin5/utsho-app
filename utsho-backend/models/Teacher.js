const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String }, // optional
  userId: { type: String, required: true, unique: true } // ✅ THIS MUST EXIST AND BE UNIQUE
}, { timestamps: true });

module.exports = mongoose.model("Teacher", teacherSchema);