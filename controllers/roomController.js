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
      createdBy: req.user.id,
    });

    res.status(201).send({ msg: "Room Created Successfully ✅" });
  } catch (error) {
    console.error("createRoom error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isActive: true }).populate(
      "building",
      "name",
    );

    res.status(200).send({ success: true, count: rooms.length, data: rooms });
  } catch (error) {
    console.error("getAllRooms error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("building", "name");

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

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
};
