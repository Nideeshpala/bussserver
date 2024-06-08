const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User=require('../models/user')

const authMiddleware = async (req, res, next) => {
  try {
    // Check if Authorization header is present and extract the token
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization denied' });
    }
    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next()
    } catch (err) {
    console.error("hai",err.message);
    return res.status(401).json({ message: 'last session expired' });
  }
};

module.exports = authMiddleware;