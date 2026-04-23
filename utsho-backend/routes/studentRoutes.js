const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

// ✅ GET all students
router.get("/", authMiddleware, async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE → admin only
router.post("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const student = new Student(req.body);
    const saved = await student.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE → admin only
router.put("/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE → admin only
router.delete("/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;