const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { auth } = require("../middleware/auth");

// Auth
router.post("/register", authController.register);
router.post("/login", authController.login);

// Profile
router.get("/profile", auth, authController.getUserInfo);


module.exports = router;