const express = require("express");
const router = express.Router();
const { getTenantDashboard } = require("../controllers/tenantDashboardController");
const { auth } = require("../middleware/auth");

// Tenant only (no admin middleware)
router.get("/dashboard", auth, getTenantDashboard);

module.exports = router;
