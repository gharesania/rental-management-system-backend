const express = require("express");
const router = express.Router();

const { auth, admin } = require("../middleware/auth");
const roomController = require("../controllers/roomController");

// Admin only
router.post("/createRoom", auth, admin, roomController.createRoom);

router.get("/getAllRooms", auth, admin, roomController.getAllRooms);

router.get("/getRoomById/:id", auth, admin, roomController.getRoomById);

router.put("/updateRoom/:id", auth, admin, roomController.updateRoom);

router.delete("/deleteRoom/:id", auth, admin, roomController.deleteRoom);

router.get("/buildingRoomStats", auth, admin,
roomController.getBuildingRoomStats,);

router.post("/assignTenant", auth, admin,
roomController.assignTenantToRoom);


module.exports = router;
