const Room = require("../models/roomModel");
const Payment = require("../models/paymentModel");
const Building = require("../models/buildingModel");

const getTenantDashboard = async (req, res) => {
  try {
    const tenantId = req.user.id;

    // 1️⃣ Get tenant's room
    const room = await Room.findOne({
      tenant: tenantId,
      isActive: true,
      status: "Occupied",
    }).populate("building", "name address");

    if (!room) {
      return res.status(200).json({
        success: true,
        data: {
          hasRoom: false,
          message: "No room assigned yet",
        },
      });
    }

    // 2️⃣ Get payments
    const payments = await Payment.find({
      tenant: tenantId,
      isActive: true,
    }).sort({ createdAt: -1 });

    const totalPaid = payments.reduce(
      (sum, p) => sum + (p.paidAmount || 0),
      0
    );

    const totalRent = payments.reduce(
      (sum, p) => sum + (p.rentAmount || 0),
      0
    );

    const dueAmount = totalRent - totalPaid;

    const lastPayment = payments[0] || null;

    res.status(200).json({
      success: true,
      data: {
        hasRoom: true,
        room: {
          roomNumber: room.roomNumber,
          floor: room.floor,
          rent: room.rent,
          deposit: room.deposit,
          occupiedFrom: room.occupiedFrom,
          building: room.building,
        },
        paymentSummary: {
          totalRent,
          totalPaid,
          dueAmount,
          lastPayment,
        },
      },
    });
  } catch (error) {
    console.error("Tenant Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tenant dashboard data",
    });
  }
};

module.exports = { getTenantDashboard };