const express = require("express");
const admin = require("../services/firebase");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "ID token is required" });
  }

  const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days

  try {
    // Verify the ID token first
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Create session cookie
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    res.cookie("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: false, // set true in production
      sameSite: 'lax'
    });

    res.status(200).json({ success: true, message: "Logged in" });
  } catch (err) {
    console.error("Login error:", err);
    const errorMessage = err.message || "Authentication failed";
    res.status(401).json({ error: errorMessage });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.send("Logged out");
});

module.exports = router;
