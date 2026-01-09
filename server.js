const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const app = express();

const port = process.env.PORT || 7010;

// Database Connection
const connectDB = require("./config/db");
// connectDB();

//Middleware
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("Hello World !!!")
});

app.listen(port, () => {
    console.log(`Server is running at ${port} ✅`);
});