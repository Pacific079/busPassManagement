const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  // include `userId` in token payload per spec and default expiry to 1 hour
  return jwt.sign({ userId: id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

module.exports = generateToken;
