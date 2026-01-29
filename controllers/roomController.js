const Room = require("../models/roomModel");

const createRoom = async (req, res) => {
  try {
    const { building, roomNumber, floor, rent, deposit } = req.body;

    if (!building || !roomNumber || rent == null || deposit == null) {
      return res.status(400).send({ msg: "Fill all the fields" });
    }

    // Check if room already exists
    const existingRoom = await Room.findOne({ building, roomNumber });

    if (existingRoom) {
      return res.status(409).send({ msg: "Room already exists" });
    }

    // Create room
    await Room.create({
      building,
      roomNumber,
      floor,
      rent,
      deposit,
      createdBy: req.user.Id,
    });

    res.status(201).send({ msg: "Room Created Successfully ✅" });
  } catch (error) {
    console.error("createRoom error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const { building } = req.query;

    const filter = { isActive: true };

    if (building) {
      filter.building = building;
    }

    const rooms = await Room.find(filter)
      .populate("building", "name")
      .populate("tenant", "name email");

    res.status(200).send({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    console.error("getAllRooms error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate(
      "building",
      "name",
    );

    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }

    res.status(200).send({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error("getRoomById error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }

    res.status(200).send({
      success: true,
      message: "Room updated successfully",
      data: room,
    });
  } catch (error) {
    console.error("updateRoom error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );

    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }

    res.status(200).send({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("deleteRoom error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getBuildingRoomStats = async (req, res) => {
  try {
    const stats = await Room.aggregate([
      { $match: { isActive: true } },

      {
        $group: {
          _id: "$building",
          totalRooms: { $sum: 1 },
          available: {
            $sum: {
              $cond: [{ $eq: ["$status", "Available"] }, 1, 0],
            },
          },
          occupied: {
            $sum: {
              $cond: [{ $eq: ["$status", "Occupied"] }, 1, 0],
            },
          },
          maintenance: {
            $sum: {
              $cond: [{ $eq: ["$status", "Maintenance"] }, 1, 0],
            },
          },
        },
      },

      {
        $lookup: {
          from: "buildings",
          localField: "_id",
          foreignField: "_id",
          as: "building",
        },
      },
      { $unwind: "$building" },

      {
        $project: {
          _id: 0,
          buildingId: "$building._id",
          name: "$building.name",
          totalRooms: 1,
          available: 1,
          occupied: 1,
          maintenance: 1,
        },
      },
    ]);

    res.status(200).send({ success: true, data: stats });
  } catch (error) {
    console.error("getBuildingRoomStats error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const assignTenantToRoom = async (req, res) => {
  try {
    const { roomId, tenantId, occupiedFrom  } = req.body;

    if (!roomId || !tenantId) {
      return res.status(400).send({ msg: "Room and Tenant are required" });
    }

    // 1️⃣ Check room
    const room = await Room.findOne({ _id: roomId, isActive: true });
    if (!room) {
      return res.status(404).send({ msg: "Room not found" });
    }

    if (room.status !== "Available") {
      return res.status(400).send({ msg: "Room is not available" });
    }

    // 2️⃣ Check tenant
    const tenant = await User.findOne({ _id: tenantId, role: "Tenant" });
    if (!tenant) {
      return res.status(404).send({ msg: "Tenant not found" });
    }

    // 3️⃣ Ensure tenant is not already assigned to another room
    const existingRoom = await Room.findOne({
      tenant: tenantId,
      status: "Occupied",
      isActive: true,
    });

    if (existingRoom) {
      return res
        .status(400)
        .send({ msg: "Tenant already occupies another room" });
    }

    // 4️⃣ Assign tenant to room
    room.status = "Occupied";
    room.tenant = tenantId;
    room.occupiedFrom = occupiedFrom ? new Date(occupiedFrom) : new Date();

    await room.save();

    res.status(200).send({
      success: true,
      msg: "Tenant assigned to room successfully ✅",
    });
  } catch (error) {
    console.error("assignTenantToRoom error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const vacateRoom = async (req, res) => {
  const { roomId } = req.body;

  const room = await Room.findById(roomId);
  if (!room || room.status !== "Occupied") {
    return res.status(400).send({ msg: "Room not occupied" });
  }

  room.status = "Available";
  room.tenant = null;
  room.occupiedFrom = null;

  await room.save();

  res.send({ msg: "Room vacated successfully" });
};

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getBuildingRoomStats,
  assignTenantToRoom,
  vacateRoom,
};
