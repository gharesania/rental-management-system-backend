const mongoose = require("mongoose");

const buildingSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    address: {
      type: String,
    },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    contactNumber: {
      type: String,
      required: true,
      minlength: 10,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Building", buildingSchema);
