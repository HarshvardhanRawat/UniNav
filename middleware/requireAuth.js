const admin = require("../services/firebase");

const requireAuth = async (req, res, next) => {
  // const token = req.headers.authorization?.split("Bearer ")[1];

  // if (!token) {
  //   return res.status(401).send("Unauthorized");
  // }

  // try {
  //   const decoded = await admin.auth().verifyIdToken(token);
  //   req.user = decoded;
  //   next();
  // } catch (err) {
  //   res.status(401).send("Invalid token");
  // }

  next();
};

module.exports = requireAuth;
