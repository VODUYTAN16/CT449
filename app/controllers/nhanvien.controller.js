const ApiError = require('../middleware/api-error');
const MongoDB = require('../utils/mongodb.util');
const NhanVienService = require('../services/nhanvien.service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.adminLogin = async (req, res, next) => {
  const { dienthoai, matkhau } = req.body;

  if (!dienthoai || !matkhau) {
    return next(new ApiError(400, 'Số điện thoại và mật khẩu không được rỗng'));
  }

  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const admin = await nhanVienService.findAdminByPhone(dienthoai);

    if (!admin) {
      return next(new ApiError(401, 'Số điện thoại không tồn tại'));
    }

    const isMatch = await bcrypt.compare(matkhau, admin.matkhau);
    if (!isMatch) {
      return next(new ApiError(401, 'Mật khẩu không đúng'));
    }

    const token = jwt.sign(
      {
        manv: admin.manv,
        role: 'admin',
        name: `${admin.hotennv}`,
      },
      config.app.jwt_secret,
      { expiresIn: '1h' }
    );

    // Ẩn mật khẩu
    delete admin.matkhau;

    return res.send({
      ...admin,
      token,
    });
  } catch (error) {
    return next(new ApiError(500, 'Lỗi đăng nhập'));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const danhMucService = new NhanVienService(MongoDB.client);
    let documents = [];
    const { dienthoai } = req.query;
    if (dienthoai) {
      documents = await danhMucService.findAdminByPhone(dienthoai);
    } else {
      documents = await danhMucService.find({});
    }

    return res.send(documents);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'Lỗi truy vấn cơ sở dữ liệu'));
  }
};

exports.create = async (req, res, next) => {
  const { dienthoai, matkhau } = req.body;

  if (!dienthoai || !matkhau) {
    return next(new ApiError(400, 'Số điện thoại và mật khẩu là bắt buộc'));
  }

  try {
    const nhanVienService = new NhanVienService(MongoDB.client);

    // Kiểm tra số điện thoại đã tồn tại chưa
    const existing = await nhanVienService.findAdminByPhone(dienthoai);
    if (existing) {
      return next(new ApiError(409, 'Số điện thoại đã được sử dụng'));
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(matkhau, 10);
    req.body.matkhau = hashedPassword;

    const newUser = await nhanVienService.createUser(req.body);
    return res.status(201).send(newUser);
  } catch (error) {
    return next(
      new ApiError(500, error.message || 'Đã xảy ra lỗi khi tạo độc giả')
    );
  }
};
