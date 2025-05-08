const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authMiddleware = (req, res, next) => {
  if (req.session.user) {
    req.userId= req.session.user.id;
    console.log(req.session)
    next();
  } else { 
    console.log(req.session)

    res.status(401).send('Unauthorized');

  }
};

module.exports = authMiddleware;
