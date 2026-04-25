const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");
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

// DELETE
router.delete("/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  await Teacher.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
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