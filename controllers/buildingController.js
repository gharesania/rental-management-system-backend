const Building = require("../models/buildingModel");

const createBuilding = async (req, res) => {
  try {
    const { name, address, contactEmail, contactNumber } = req.body;

    const building = await Building.create({
      name,
      address,
      contactEmail,
      contactNumber,
      createdBy: req.user.id,
    });

    res.status(201).send({
      msg: "Building created successfully",
      success: true,
      data: building,
    });
  } catch (error) {
    console.log("createBuilding Error: ", error);
    res.status(500).send("Internal Server Error");
  }
};

const getAllBuildings = async (req, res) => {
  try {
    const buildings = await Building.find({ isActive: true });

    res.status(200).send({ success: true, data: buildings });
  } catch (error) {
    console.log("getAllBuildings Error: ", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {createBuilding, getAllBuildings}