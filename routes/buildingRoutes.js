const express = require("express");
const { auth, admin } = require("../middleware/auth");
const buildingController = require("../controllers/buildingController")
const router = express.Router();

// Admin only
router.post("/createBuilding", auth, admin, buildingController.createBuilding);

router.get("/getAllBuildings", auth, admin, buildingController.getAllBuildings)

module.exports = router