const express = require("express");
const router = express.Router();
const Notice = require("../models/Notice");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

// GET (all users)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST (admin only)
router.post("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const notice = new Notice(req.body);
    const saved = await notice.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;