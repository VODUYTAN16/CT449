const express = require('express');
const router = express.Router();
const sachController = require('../controllers/sach.controller');
const theoDoiMuonSachController = require('../controllers/theodoimuonsach.controller');
const docgiaController = require('../controllers/docgia.controller');

// Các route yêu cầu xác thực
// router.use(verifyToken);
// router.use(isUser); // Chỉ cho phép người dùng

// Xem sách
router.route('/books').get(sachController.findAll);

// Tìm kiếm sách (sử dụng query: ?masach=...)
router.route('/books/search').get(sachController.findAll);

// Đăng ký mượn sách
router.route('/borrow').post(theoDoiMuonSachController.create);

// Xem lịch sử mượn sách
router.route('/borrow/history/:userId').get(theoDoiMuonSachController.history);

module.exports = router;
