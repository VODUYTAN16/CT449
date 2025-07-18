const ApiError = require('../middleware/api-error');
const MongoDB = require('../utils/mongodb.util');
const SachService = require('../services/sach.service');
const fs = require('fs');

exports.findAll = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    console.log('start');
    const { masach } = req.query;
    console.log(masach);
    const documents = masach
      ? await sachService.findByTitle(masach)
      : await sachService.find({});

    // const contentPath = './app/content.md';
    // const content = fs.readFileSync(contentPath, 'utf-8');
    // if (masach) {
    //   documents[0].noidung = content;
    // }

    return res.send(documents);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'Lỗi truy vấn cơ sở dữ liệu'));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, 'Dữ liệu cập nhật không được rỗng'));
  }

  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, 'Không tìm thấy sách'));
    }
    return res.send({ message: 'Sách đã được cập nhật thành công' });
  } catch (error) {
    return next(new ApiError(500, `Lỗi cập nhật sách id=${req.params.id}`));
  }
};

exports.create = async (req, res, next) => {
  if (!req.body?.tensach) {
    return next(new ApiError(400, 'Tên sách không được để trống'));
  }

  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, 'Đã xảy ra lỗi khi thêm sách mới'));
  }
};
