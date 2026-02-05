const Building = require("../models/buildingModel");

const createBuilding = async (req, res) => {
  try {
    const { name, address, contactEmail, contactNumber } = req.body;

    if (!name || !contactNumber) {
      return res.status(400).send({
        success: false,
        msg: "Name and contact number are required",
      });
    }

    const existingBuilding = await Building.findOne({ isActive: true });
    if (existingBuilding) {
      return res.status(400).send({
        success: false,
        msg: "Active building already exists",
      });
    }

    const building = await Building.create({
      name,
      address,
      contactEmail,
      contactNumber,
      createdBy: req.user.id,
    });

    res.status(201).send({
      success: true,
      msg: "Building created successfully",
      data: building,
    });
  } catch (error) {
    console.error("createBuilding Error:", error);
    res.status(500).send({ success: false, msg: "Internal Server Error" });
  }
};

const getAllBuildings = async (req, res) => {
  try {
    const buildings = await Building.find({ isActive: true });
    res.status(200).send({ success: true, data: buildings });
  } catch (error) {
    console.error("getAllBuildings Error:", error);
    res.status(500).send({ success: false, msg: "Internal Server Error" });
  }
};

const updateBuilding = async (req, res) => {
  try {
    const updates = (({ name, address, contactEmail, contactNumber }) => ({
      name,
      address,
      contactEmail,
      contactNumber,
    }))(req.body);

    const building = await Building.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    res.send({ success: true, data: building });
  } catch (error) {
    console.error("updateBuilding Error:", error);
    res.status(500).send({ success: false, msg: "Internal Server Error" });
  }
};

const deleteBuilding = async (req, res) => {
  try {
    await Building.findByIdAndUpdate(req.params.id, { isActive: false });
    res.send({ success: true, msg: "Building deleted" });
  } catch (error) {
    console.error("deleteBuilding Error:", error);
    res.status(500).send({ success: false, msg: "Internal Server Error" });
  }
};

module.exports = {
  createBuilding,
  getAllBuildings,
  updateBuilding,
  deleteBuilding,
};
