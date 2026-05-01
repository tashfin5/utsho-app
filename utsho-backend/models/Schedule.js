const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  subject: String,
  teacher: String,
  teacherId: String,
  className: String,
  time: String,
  room: String,
  day: String
}, { timestamps: true });

module.exports = mongoose.model("Schedule", scheduleSchema);