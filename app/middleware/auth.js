// middleware/auth.js
const jwt = require('jsonwebtoken');
const ApiError = require('./api-error');
const config = require('../config');

module.exports = function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return next(new ApiError(401, 'Không có token'));

  jwt.verify(token, config.app.jwt_secret, (err, user) => {
    if (err) return next(new ApiError(403, 'Token không hợp lệ'));
    req.user = user; // lưu user info vào request để route sau dùng
    next();
  });
};
