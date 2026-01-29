const express = require("express");
const { auth, admin } = require("../middleware/auth");
const buildingController = require("../controllers/buildingController")
const router = express.Router();

// Admin only
router.post("/createBuilding", auth, admin, buildingController.createBuilding);

router.get("/getAllBuildings", auth, admin, buildingController.getAllBuildings);

router.put("/updateBuilding/:id", auth, admin, buildingController.updateBuilding);

router.get("/deleteBuilding/:id", auth, admin, buildingController.deleteBuilding);


module.exports = router