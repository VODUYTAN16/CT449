const express = require('express');
const router = express.Router();
const sachController = require('../controllers/sach.controller');
const theoDoiMuonSachController = require('../controllers/theodoimuonsach.controller');
const docgiaController = require('../controllers/docgia.controller');
const danhMucController = require('../controllers/danhmuc.controller');

router
  .route('/category')
  .post(danhMucController.create)
  .get(danhMucController.findAll);

module.exports = router;
