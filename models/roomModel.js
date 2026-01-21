const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
  {
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    floor: {
      type: String,
    },
    rent: {
      type: Number,
      required: true,
      min: 0,
    },
    deposit: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Available", "Occupied", "Maintenance"],
      default: "Available",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Room", roomSchema);
