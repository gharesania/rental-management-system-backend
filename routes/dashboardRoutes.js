const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboardController");
const { auth, admin } = require("../middleware/auth");

router.get("/dashboardStats", auth, admin, getDashboardStats);

module.exports = router;
