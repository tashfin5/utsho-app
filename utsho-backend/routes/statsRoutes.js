const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Notice = require("../models/Notice");

const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const studentCount = await Student.countDocuments();
    const teacherCount = await Teacher.countDocuments();
    const noticeCount = await Notice.countDocuments();

    res.json({
      students: studentCount,
      teachers: teacherCount,
      notices: noticeCount
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;