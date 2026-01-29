const Building = require("../models/buildingModel");
const Room = require("../models/roomModel");
const User = require("../models/userModel");

const getDashboardStats = async (req, res) => {
  try {
    // Buildings
    const totalBuildings = await Building.countDocuments({
      isActive: true,
    });

    // Rooms
    const totalRooms = await Room.countDocuments({
      isActive: true,
    });

    const availableRooms = await Room.countDocuments({
      isActive: true,
      status: "Available",
    });

    const occupiedRooms = await Room.countDocuments({
      isActive: true,
      status: "Occupied",
    });

    // Tenants
    const totalTenants = await User.countDocuments({
      role: "Tenant",
    });

    res.status(200).json({
      success: true,
      data: {
        totalBuildings,
        totalRooms,
        availableRooms,
        occupiedRooms,
        totalTenants,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

module.exports = {
  getDashboardStats,
};
