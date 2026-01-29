const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { auth, admin } = require("../middleware/auth");

// Auth
router.post("/register", userController.register);

router.post("/login", userController.login);

// Profile
router.get("/profile", auth, userController.getUserInfo);
router.put("/profile", auth, userController.updateProfile);

// Public Routes
router.get("/building", userController.getBuildingInfo);

router.get("/roomsAvailable", userController.getAvailableRooms);

// route
router.get("/getAllTenants", auth, admin, userController.getAllTenants);

module.exports = router;