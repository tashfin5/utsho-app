const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");
const User = require("../models/User");
const Student = require("../models/Student"); // ✅ Added
const Teacher = require("../models/Teacher"); // ✅ Added
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

// ◆ GET schedules (Smart Role-Based Filter)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tokenUser = req.user;
    let schedules = [];

    const fullUser = await User.findById(tokenUser.id);
    if (!fullUser) return res.status(404).json({ message: "User not found" });

    if (fullUser.role === "admin") {
      schedules = await Schedule.find();
    } 
    else if (fullUser.role === "teacher") {
      // ✅ Look up the Teacher profile to get their exact DB ID
      const teacherProfile = await Teacher.findOne({ userId: fullUser.userId });
      if (teacherProfile) {
        schedules = await Schedule.find({
          $or: [
            { teacherId: teacherProfile._id.toString() },
            { teacherId: fullUser.userId }
          ]
        });
      }
    } 
    else if (fullUser.role === "student") {
      // ✅ Look up the Student profile to find out what class they are in
      const studentProfile = await Student.findOne({ userId: fullUser.userId });
      if (studentProfile && studentProfile.className) {
        schedules = await Schedule.find({ className: studentProfile.className });
      }
    }

    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ◆ CREATE (ADMIN ONLY)
router.post("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const schedule = new Schedule(req.body);
    await schedule.save();
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ◆ UPDATE (ADMIN ONLY)
router.put("/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSchedule) return res.status(404).json({ error: "Class not found" });
    res.json(updatedSchedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ◆ DELETE (ADMIN ONLY)
router.delete("/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!deletedSchedule) return res.status(404).json({ error: "Class not found" });
    res.json({ message: "Class successfully deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;