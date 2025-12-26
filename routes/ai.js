const express = require("express");
const router = express.Router();
const askGemini = require("../services/gemini.js");
const Room = require("../models/rooms.js");
const requireAuth = require("../middleware/requireAuth.js");
const wrapAsync = require("../utilts/wrapAsync.js");

// GET route to render the AI question page
router.get("/", requireAuth, (req, res) => {
  res.render("../views/index/ai", { answer: null });
});

// POST route to handle AI question submission
router.post("/ask", requireAuth, wrapAsync(async (req, res) => {
  const userQuestion = req.body.question;

  if (!userQuestion || userQuestion.trim().length === 0) {
    const ExpressError = require("../utilts/ExpressError.js");
    throw new ExpressError(400, "Question is required");
  }

  const rooms = await Room.find();

  const context = rooms.map(r =>
    `Building: ${r.building}, Floor: ${r.floor}, Room: ${r.room}, Landmark: ${r.landmark}, ${r.directionHint ? `Direction Hint: ${r.directionHint}, ` : ''}DIGIPIN: ${r.digipin}`
  ).join("\n");

  const prompt = `
You are a campus navigation assistant.

Answer ONLY using the data below.
Do NOT invent anything.

For the answer, return this format:

Location -
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
}));

module.exports = router;
