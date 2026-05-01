const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");
const generateUserId = require("../utils/generateId");


// =========================
// CREATE USER (ADMIN ONLY)
// =========================
router.post("/create-user", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, password, role } = req.body;

    if (!name || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🔥 IMPORTANT: generate FIRST
    const newUserId = await generateUserId(role);

    // 🔐 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ create user (NO variable confusion)
    const newUser = new User({
      name: name,
      password: hashedPassword,
      role: role,
      userId: newUserId
    });

    await newUser.save();

    res.json({
      message: "User created successfully",
      userId: newUserId
    });

  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// =========================
// LOGIN
// =========================
router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ message: "User ID and password required" });
    }

    // ✅ normalize
    const normalizedUserId = userId.trim().toUpperCase();

    const user = await User.findOne({ userId: normalizedUserId });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// =========================
// GET CURRENT USER
// =========================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error("ME ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;