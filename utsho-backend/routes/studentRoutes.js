const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const User = require("../models/User");
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
    console.log("BODY:", req.body); // 🔍 debug

    const student = new Student({
      name: req.body.name,
      rollNumber: req.body.rollNumber,
      className: req.body.className,
      phone: req.body.phone,
      userId: req.body.userId || "TEMP" // fallback to avoid crash
    });

    const saved = await student.save();

    res.status(201).json(saved);

  } catch (err) {
    console.error("❌ CREATE STUDENT ERROR:", err); // 🔥 THIS IS KEY
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

// ◆ DELETE STUDENT & LOGIN ACCOUNT (ADMIN ONLY)
router.delete("/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    // 1. Find the student first to get their custom userId (e.g. STU-123)
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // 2. Delete their login account from the User collection
    if (student.userId) {
      await User.findOneAndDelete({ userId: student.userId });
    }

    // 3. Delete their profile from the Student collection
    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: "Student and login access completely removed" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;