const Building = require("../models/buildingModel");
const Room = require("../models/roomModel");

const getBuildingInfo = async (req, res) => {
  try {
    const building = await Building.findOne({ isActive: true }).select(
      "name address contactEmail contactNumber",
    );

    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }

    res.status(200).json({ success: true, data: building });
  } catch (error) {
    console.error("getBuildingInfo error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      status: "Available",
      isActive: true,
    })
      .select("roomNumber floor rent deposit")
      .populate("building", "name");

    res.status(200).json({
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("getAvailableRooms error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getBuildingInfo,
  getAvailableRooms,
};
