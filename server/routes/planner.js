const express = require("express");
const router = express.Router();
require("dotenv").config();
const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

router.post("/plan", async (req, res) => {
  let { tasks, date } = req.body;

  console.log(" Received tasks:", tasks);

  
  if (Array.isArray(tasks)) {
  
  } else if (typeof tasks === "string") {
    tasks = tasks.split(",").map((t) => t.trim()).filter(Boolean);
  } else {
    
    tasks = [];
  }

  console.log(" Parsed tasks:", tasks);

  const prompt = `Create a structured, hour-by-hour daily plan for ${date || "today"} with the following tasks: ${tasks.join(", ")}. Include short breaks and prioritize focus.`;

  try {
    const response = await cohere.generate({
      model: "command-r-plus",
      prompt,
      maxTokens: 300,
      temperature: 0.7,
    });

    const plan = response.generations[0]?.text || "No plan generated.";
    res.json({ plan });
  } catch (err) {
    console.error("Cohere error:", err?.response?.data || err.message || err);
    res.status(500).json({ error: "Cohere API failed." });
  }
});

module.exports = router;

