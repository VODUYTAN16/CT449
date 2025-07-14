const express = require('express');
const router = express.Router();
const sachController = require('../controllers/sach.controller');
const theoDoiMuonSachController = require('../controllers/theodoimuonsach.controller');
const nhanVienController = require('../controllers/nhanvien.controller');
const docgiaController = require('../controllers/docgia.controller');
const noiDungSachController = require('../controllers/noidungsach.controller');
const nhaXuatBanController = require('../controllers/nhaxuatban.controller');
const danhMucController = require('../controllers/danhmuc.controller');

// Các route yêu cầu xác thực và quyền admin
// router.use(verifyToken);
// router.use(isAdmin);
// layDS nhanvien
router.route('/staffs').get(nhanVienController.findAll);
router.route('/users').get(docgiaController.findAll);

//
router.route('/books').post(sachController.create); // Thêm sách mới

// Cập nhật thông tin sách
router.route('/books/:id').put(sachController.update);

// Quản lý mượn sách (cập nhật trạng thái)
router.route('/borrow/:id').put(theoDoiMuonSachController.update);
// Lấy lịch sử mượn sách
router.route('/borrow').get(theoDoiMuonSachController.history);
//user
router.route('/users').post(docgiaController.create);

//
router
  .route('/nxb')
  .post(nhaXuatBanController.create)
  .get(nhaXuatBanController.findAll);
//Tạo nội dung sách
router
  .route('/contents')
  .post(noiDungSachController.create)
  .get(noiDungSachController.findAll);

module.exports = router;
