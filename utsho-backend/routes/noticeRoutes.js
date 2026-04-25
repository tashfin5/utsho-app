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

// DELETE NOTICE (ADMIN ONLY)
router.delete("/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: "Notice deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const updated = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id/pin", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    notice.isPinned = !notice.isPinned;
    await notice.save();

    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;