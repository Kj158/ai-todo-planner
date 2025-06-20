const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const plannerRoutes = require("./routes/planner");
app.use("/api", plannerRoutes);

module.exports = app;

