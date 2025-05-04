const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(400).json({ error: "Invalid MongoDB ID in token" });
    }

    req.userId = decoded.id; // store in request object for downstream access
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = adminAuth;
