const express = require("express");
const router = express.Router();
const askGemini = require("../services/gemini.js");
const Room = require("../models/rooms.js");
const requireAuth = require("../middleware/requireAuth.js");

router.get("/", requireAuth, (req, res) => {
  res.render("../views/index/ai", { answer: null });
});

router.post("/ask", requireAuth, async (req, res) => {
  const userQuestion = req.body.question;

  const rooms = await Room.find();

  const context = rooms.map(r =>
    `Building: ${r.building}, Floor: ${r.floor}, Room: ${r.room}, Landmark: ${r.landmark}, ${r.directionHint ? `Direction Hint: ${r.directionHint}, ` : ''}DIGIPIN: ${r.digipin}`
  ).join("\n");

  const prompt = `
You are a campus navigation assistant.

Answer ONLY using the data below.
Do NOT invent anything.

For the answer, return this format:

Location:
Building:
Floor:
Room:
Landmark:
Direction Hint:
DIGIPIN:
Map:

DATA:
${context}

QUESTION:
${userQuestion}

Reply in simple points.
`;

  const answer = await askGemini(prompt);

  res.render("../views/index/ai", { answer });
});

module.exports = router;
