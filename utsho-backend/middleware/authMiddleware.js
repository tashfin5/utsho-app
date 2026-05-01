const jwt = require("jsonwebtoken");

// ✅ AUTH MIDDLEWARE
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];

    // ❌ No token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    // ✅ VERIFY TOKEN (use env variable)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user info
    req.user = decoded;

    next();

  } catch (err) {
    console.error("Auth error:", err.message);

    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token"
    });
  }
};


// ✅ ROLE CHECK MIDDLEWARE
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }
      next();
    } catch (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
  };
};

module.exports = { authMiddleware, authorizeRoles };