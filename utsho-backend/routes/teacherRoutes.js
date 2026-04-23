const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

// ✅ GET all teachers
router.get("/", authMiddleware, async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE → admin only
router.post("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    const saved = await teacher.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE → admin only
router.put("/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(
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
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: "Teacher deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;