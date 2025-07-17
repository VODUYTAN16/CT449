// routes/docgia.route.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const DocGiaService = require('../services/docgia.service');
const NhanVienService = require('../services/nhanvien.service');
const MongoDB = require('../utils/mongodb.util');
const docgiaController = require('../controllers/docgia.controller');
const nhanVienController = require('../controllers/nhanvien.controller');
const ApiError = require('../middleware/api-error');

router.post('/verify-token', authenticateToken, async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new ApiError(500, 'token expired'));
    }
    res.send({ message: 'Not expire', user: req.user });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'token expired'));
  }
});

// Đăng nhập
router.route('/login').post(docgiaController.userLogin);
router.route('/register').post(docgiaController.create);

// Đăng nhập admin
router.route('/login-admin').post(nhanVienController.adminLogin);
router.route('/register-admin').post(nhanVienController.create);
module.exports = router;
