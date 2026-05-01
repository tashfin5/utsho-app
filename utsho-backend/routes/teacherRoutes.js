const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");
const User = require("../models/User");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

// GET all
router.get("/", authMiddleware, async (req, res) => {
  const teachers = await Teacher.find().sort({ createdAt: -1 });
  res.json(teachers);
});

// CREATE
router.post("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    const saved = await teacher.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ◆ DELETE TEACHER & LOGIN ACCOUNT (ADMIN ONLY)
router.delete("/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    // 1. Find the teacher first to get their custom userId (e.g. TCH-123)
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // 2. Delete their login account from the User collection
    if (teacher.userId) {
      await User.findOneAndDelete({ userId: teacher.userId });
    }

    // 3. Delete their profile from the Teacher collection
    await Teacher.findByIdAndDelete(req.params.id);

    res.json({ message: "Teacher and login access completely removed" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const teachers = await User.find({
      role: { $regex: /^teacher$/i } // 🔥 case-insensitive safe
    }).select("name userId");

    res.json(teachers);

  } catch (err) {
    console.error("TEACHER FETCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;