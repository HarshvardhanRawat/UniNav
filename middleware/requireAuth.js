const admin = require("../services/firebase");

// Middleware to require authentication
const requireAuth = async (req, res, next) => {
  // Ensure cookies object exists
  if (!req.cookies) {
    console.error("requireAuth: No cookies object found in request");
    return res.redirect("/login");
  }

  const sessionCookie = req.cookies.session;

  // Strict validation: cookie must exist, be a string, and not be empty
  if (!sessionCookie || typeof sessionCookie !== 'string' || sessionCookie.trim().length === 0) {
    console.log("requireAuth: No valid session cookie found, redirecting to login");
    res.clearCookie("session", { path: '/' });
    return res.redirect("/login");
  }

  // Verify session cookie with Firebase Admin
  try {
    const decoded = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true /* checkRevoked */);

    // Additional validation: decoded token should have required fields
    if (!decoded || !decoded.uid) {
      throw new Error("Invalid token: missing uid");
    }

    // If verification successful, attach user to request and continue
    req.user = decoded;
    next();
  } catch (err) {
    // Log error for debugging
    console.error("requireAuth: Session verification failed -", err.message);
    console.error("requireAuth: Cookie value:", sessionCookie.substring(0, 20) + "...");
    
    // Clear the invalid cookie with all possible options
    res.clearCookie("session", { 
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    });
    
    // Always redirect to login - never allow access
    return res.redirect("/login");
  }
};

module.exports = requireAuth;
