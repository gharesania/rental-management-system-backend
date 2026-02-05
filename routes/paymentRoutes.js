const express = require("express");
const router = express.Router();
const { auth, admin } = require("../middleware/auth");
const paymentController = require("../controllers/paymentController");

router.post("/addPayment", auth, admin, paymentController.createPayment);

router.get("/viewAllPayments", auth, admin, paymentController.getAllPayments);

router.put("/updatePayment/:id", auth, admin, paymentController.updatePayment);

router.get("/myPayments", auth, paymentController.getMyPayments);

module.exports = router;
