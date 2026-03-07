const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { errorResponse } = require('../utils/apiResponse');

// Verify token middleware
exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Not authorized. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // token payload uses `userId` (see generateToken)
    const user = await User.findById(decoded.userId).select('-password');
    // Don't reveal whether user exists — treat as unauthorized
    if (!user || !user.isActive) return errorResponse(res, 'Invalid token.', 401);

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired. Please login again.', 401);
    }
    return errorResponse(res, 'Invalid token.', 401);
  }
};

// Role authorization factory
exports.authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return errorResponse(res, 'Access denied.', 403);
  }
  next();
};

// Backwards compatible aliases used across the codebase
exports.protect = exports.verifyToken;
exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') return errorResponse(res, 'Access denied.', 403);
  next();
};
