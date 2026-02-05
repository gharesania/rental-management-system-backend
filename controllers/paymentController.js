const Payment = require("../models/paymentModel");
const Room = require("../models/roomModel");

const createPayment = async (req, res) => {
  try {
    const {
      tenant,
      room,
      building,
      month,
      paidAmount,
      paymentMode,
      paymentDate,
    } = req.body;

    if (!tenant || !room || !building || !month) {
      return res.status(400).send({ msg: "Required fields missing" });
    }

    // Prevent duplicate month payment
    const existing = await Payment.findOne({ tenant, room, month });

    if (existing) {
      return res
        .status(409)
        .send({ msg: "Payment already exists for this month" });
    }

    // Get rent from room
    const roomData = await Room.findOne({
      _id: room,
      tenant,
      status: "Occupied",
      isActive: true,
    });

    if (!roomData) {
      return res.status(400).send({
        msg: "Room is not occupied by this tenant",
      });
    }

    const rentAmount = roomData.rent;

    let status = "Due";

    if (paidAmount >= rentAmount) {
      status = "Paid";
    } else if (paidAmount > 0) {
      status = "Partial";
    }

    const payment = await Payment.create({
      tenant,
      room,
      building,
      month,
      rentAmount,
      paidAmount,
      paymentMode,
      paymentDate,
      status,
      createdBy: req.user.id,
    });

    res.status(201).send({
      success: true,
      msg: "Payment recorded successfully",
      data: payment,
    });
  } catch (error) {
    console.error("createPayment error:", error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("tenant", "name email")
      .populate("room", "roomNumber")
      .populate("building", "name")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("getAllPayments error:", error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const updatePayment = async (req, res) => {
  try {
    const { paidAmount, paymentMode, paymentDate } = req.body;

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).send({ msg: "Payment not found" });
    }

    payment.paidAmount = paidAmount;
    payment.paymentMode = paymentMode;
    payment.paymentDate = paymentDate;

    if (paidAmount >= payment.rentAmount) {
      payment.status = "Paid";
    } else if (paidAmount > 0) {
      payment.status = "Partial";
    } else {
      payment.status = "Due";
    }

    await payment.save();

    res.status(200).send({
      success: true,
      msg: "Payment updated successfully",
      data: payment,
    });
  } catch (error) {
    console.error("updatePayment error:", error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const getMyPayments = async (req, res) => {
  try {
    const tenantId = req.user.id;

    const payments = await Payment.find({
      tenant: tenantId,
      isActive: true,
    })
      .populate("room", "roomNumber")
      .populate("building", "name")
      .sort({ month: -1 });

    res.status(200).send({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("getMyPayments error:", error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  updatePayment,
  getMyPayments,
};
