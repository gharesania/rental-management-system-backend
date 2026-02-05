const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ msg: "Authorization header missing ⚠️" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Bearer token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // ✅ NORMALIZED USER OBJECT
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.log("Token Error:", error);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

const admin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ msg: "Admin access only" });
  }
  next();
};

module.exports = { auth, admin };
