// middleware/requireAuth.js
const admin = require("../services/firebase");

// Middleware to require authentication
const requireAuth = async (req, res, next) => {
  const sessionCookie = req.cookies.session;

  // If no session cookie, redirect to login
  if (!sessionCookie) {
    return res.redirect("/login");
  }
  // Verify session cookie
  try {
    const decoded = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);

    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie("session");
    res.redirect("/login");
  }
};

module.exports = requireAuth;
