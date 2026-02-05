const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔑 Payment details
    month: {
      type: String, // e.g. "2025-02"
      required: true,
    },
    rentAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentMode: {
      type: String,
      enum: ["CASH", "UPI", "BANK_TRANSFER"],
      default: "CASH",
    },

    status: {
      type: String,
      enum: ["Paid", "Partial", "Due"],
      default: "Due",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 🚫 Prevent duplicate payments for same month
paymentSchema.index(
  { room: 1, tenant: 1, month: 1 },
  { unique: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
