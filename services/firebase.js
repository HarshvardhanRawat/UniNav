const admin = require("firebase-admin");
const serviceAccount = require("./firebaseKey.json");

// Initialize Firebase Admin only if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    throw error;
  }
}

module.exports = admin;
