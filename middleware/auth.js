const jwt = require("jsonwebtoken");
// require("dotenv").config();

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check header
    if (!authHeader) {
      return res.status(401).json({ msg: "Authorization header missing ⚠️" });
    }

    // Check Bearer
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Bearer token missing" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Token Error: ", error)
    res.status(401).json({
      msg: "Invalid or expired token",
    });
  }
};

const admin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ msg: "Admin access only" });
  }
  next();
};

module.exports = { auth, admin };
