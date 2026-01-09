const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Database connected successfully ✅");
  } catch (error) {
    console.log("Database Connection Error: ", error);
    process.exit(1); //Optional : exit app if DB fails
  }
}

connectDB();