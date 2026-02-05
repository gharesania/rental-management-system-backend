const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

// Routes
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes")
const buildingRoutes = require("./routes/buildingRoutes");
const roomRoutes = require("./routes/roomRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const tenantDashboardRoutes = require("./routes/tenantDashboardRoutes");


const app = express();

const port = process.env.PORT || 7010;

// Database Connection
const connectDB = require("./config/db");
// connectDB();

//Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/tenant", tenantDashboardRoutes);
app.use("/api/payments", paymentRoutes);



app.get("/", (req, res) => {
  res.send("Hello World !!!");
});

app.listen(port, () => {
  console.log(`Server is running at ${port} ✅`);
});
