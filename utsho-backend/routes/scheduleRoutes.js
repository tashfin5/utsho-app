const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

// 🔹 GET schedules (role-based)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    let schedules;

    if (user.role === "admin") {
      schedules = await Schedule.find();
    } else if (user.role === "teacher") {
      schedules = await Schedule.find({ teacherId: user.userId });
    } else if (user.role === "student") {
      schedules = await Schedule.find({ className: user.assignedClass });
    }

    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 CREATE (ADMIN ONLY)
router.post("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    console.log("BODY:", req.body); // 🔥 ADD THIS

    const schedule = new Schedule(req.body);
    await schedule.save();

    res.json(schedule);
  } catch (err) {
    console.error("SCHEDULE ERROR:", err); // 🔥 ADD THIS
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;