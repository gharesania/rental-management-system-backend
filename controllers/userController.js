const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      contactNumber,
      password,
      currentAddress,
      permanentAddress,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).send({ msg: "User already exists !" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
      name,
      email,
      contactNumber,
      password: hashedPassword,
      currentAddress,
      permanentAddress,
    });

    res
      .status(201)
      .send({ msg: "User registered successfully ✅", userId: user._id });
  } catch (error) {
    console.log("Registration Error: ", error);
    res.status(500).send({ msg: "Registration failed ⚠️" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({ msg: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).send({
      msg: "Login successful !",
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).send({ msg: "Login failed" });
  }
};

const getUserInfo = async (req, res) => {
  try {
    console.log("REQ.USER 👉", req.user);

    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Profile Error: ", error);
    res.status(500).json({ message: "Failed to fetch user info" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, contactNumber, currentAddress, permanentAddress } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        contactNumber,
        currentAddress,
        permanentAddress,
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }

    res.status(200).send({
      success: true,
      msg: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("updateUserProfile error:", error);
    res.status(500).send({ msg: "Failed to update profile" });
  }
};

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

const getAllTenants = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = { role: "Tenant" };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { contactNumber: { $regex: search, $options: "i" } },
      ];
    }

    const tenants = await User.find(filter)
      .select("-password")
      .populate({
        path: "assignedRoom",
        select: "roomNumber",
        populate: {
          path: "building",
          select: "name",
        },
      });

    res.status(200).send({
      success: true,
      data: tenants,
    });
  } catch (error) {
    console.error("getAllTenants error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = { register, login, getUserInfo, updateProfile, getBuildingInfo, getAvailableRooms, getAllTenants};