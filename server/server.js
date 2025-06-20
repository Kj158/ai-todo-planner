require('dotenv').config(); 

const express = require("express");
const cors = require("cors");
const plannerRoutes = require("./routes/planner");

console.log("Cohere Key:", process.env.COHERE_API_KEY ? "FOUND" : "NOT FOUND");


const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.use("/api", plannerRoutes);

app.get("/", (req, res) => {
  res.send("AI Planner API is running");
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
