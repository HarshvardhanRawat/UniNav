const express = require("express");
const router = express.Router();
const askGemini = require("../services/gemini.js");
const Room = require("../models/rooms.js");
const requireAuth = require("../middleware/requireAuth.js");

router.get("/", requireAuth, (req, res) => {
  res.render("ai");
});

router.post("/ask", requireAuth, async (req, res) => {
  const userQuestion = req.body.question;

  const rooms = await Room.find();

  const context = rooms.map(r =>
    `Building: ${r.building}, Floor: ${r.floor}, Room: ${r.room}, Landmark: ${r.landmark}, DIGIPIN: ${r.digipin}`
  ).join("\n");

  const prompt = `
You are a campus navigation assistant.
Using ONLY the data below, answer the question clearly.

DATA:
${context}

QUESTION:
${userQuestion}

Reply in simple points.
`;

  const answer = await askGemini(prompt);

  res.render("ai", { answer });
});

module.exports = router;
