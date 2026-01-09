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

    // Find user
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    // Check active status
    if (!user.isActive) {
      return res
        .status(403)
        .send({ msg: "User account is inactive. Conatct admin " });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ msg: "Invalid credentials !" });
    }

    // Generate token
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {expiresIn: process.env.JWT_EXPIRES_IN || "1d"}
    );

    res
      .status(202)
      .send({ msg: "Log in successfull !", success: true, token: token });
  } catch (error) {
    console.log("Login Error: ", error);
    res.status(500).json({ message: "Login failed", error });
  }
};

const getUserInfo = async (req, res) => {
  try {
    console.log("REQ.USER 👉", req.user);

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Profile Error: ", error);
    res.status(500).json({ message: "Failed to fetch user info", error });
  }
};

module.exports = { register, login, getUserInfo };
