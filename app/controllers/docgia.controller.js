const ApiError = require('../middleware/api-error');
const MongoDB = require('../utils/mongodb.util');
const DocGiaService = require('../services/docgia.service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.userLogin = async (req, res, next) => {
  const { dienthoai, matkhau } = req.body;

  if (!dienthoai || !matkhau) {
    return next(new ApiError(400, 'Số điện thoại và mật khẩu không được rỗng'));
  }

  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const user = await docGiaService.findUserByPhone(dienthoai);

    if (!user) {
      return next(new ApiError(401, 'Số điện thoại không tồn tại'));
    }

    const isMatch = await bcrypt.compare(matkhau, user.matkhau);
    if (!isMatch) {
      return next(new ApiError(401, 'Mật khẩu không đúng'));
    }

    console.log('mk: ', isMatch);
    console.log('jwt: ', config.jwt_secret);
    const token = jwt.sign(
      {
        madocgia: user.madocgia,
        role: 'user',
        name: `${user.holot} ${user.ten}`,
      },
      config.app.jwt_secret,
      { expiresIn: '1h' }
    );

    // Xoá mật khẩu trước khi trả về
    delete user.matkhau;

    return res.send({
      ...user,
      token,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'Lỗi đăng nhập'));
  }
};

exports.create = async (req, res, next) => {
  const { dienthoai, matkhau } = req.body;

  if (!dienthoai || !matkhau) {
    return next(new ApiError(400, 'Số điện thoại và mật khẩu là bắt buộc'));
  }

  try {
    const userService = new DocGiaService(MongoDB.client);

    // Kiểm tra số điện thoại đã tồn tại chưa
    const existing = await userService.findUserByPhone(dienthoai);
    console.log(existing);
    if (existing) {
      return next(new ApiError(409, 'Số điện thoại đã được sử dụng'));
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(matkhau, 10);
    req.body.matkhau = hashedPassword;
    const readers = await userService.find({});
    const madocgia = readers.length + 1;
    req.body.madocgia = madocgia;

    const newUser = await userService.createUser(req.body);
    return res.status(201).send(newUser);
  } catch (error) {
    return next(
      new ApiError(500, error.message || 'Đã xảy ra lỗi khi tạo độc giả')
    );
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    let documents = [];
    const { dienthoai } = req.query;
    if (dienthoai) {
      documents = await docGiaService.findUserByPhone(dienthoai);
    } else {
      documents = await docGiaService.find({
        $or: [{ daxoa: false }, { daxoa: { $exists: false } }],
      });
    }

    return res.send(documents);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'Lỗi truy vấn cơ sở dữ liệu'));
  }
};

exports.delete = async (req, res, next) => {
  console.log(req.query);
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const response = docGiaService.softDelete(req.query.madocgia);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'Lỗi khi xóa đọc giả'));
  }
};

exports.update = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const response = docGiaService.update(req.body);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'Lỗi khi update đọc giả'));
  }
};
