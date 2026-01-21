const express = require ("express");
const router = express.Router();
const publicController = require("../controllers/publicController")

router.get("/building", publicController.getBuildingInfo);
router.get("/rooms/available", publicController.getAvailableRooms)

module.exports = router;