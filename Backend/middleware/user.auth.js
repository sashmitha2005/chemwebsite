const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authMiddleware = (req, res, next) => {
  const tokenHeader = req.header('x-auth-token') || req.header('authorization');
  let token;

  if (tokenHeader && tokenHeader.startsWith('Bearer ')) {
    token = tokenHeader.split(' ')[1];
  } else {
    token = tokenHeader;
  }

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
    req.userId = decoded.user.id;
    console.log(decoded.user.id);
    console.log('User authenticated:', decoded.user);
    next();
  } catch (err) { 
    console.error('Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

module.exports = authMiddleware;
