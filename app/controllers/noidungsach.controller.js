const ApiError = require('../middleware/api-error');
const MongoDB = require('../utils/mongodb.util');
const NoiDungSachService = require('../services/noidungsach.service');

exports.create = async (req, res, next) => {
  if (!req.body?.noidung) {
    return next(new ApiError(400, 'Nội dung sách không được để trống'));
  }

  try {
    const ndSachService = new NoiDungSachService(MongoDB.client);
    const document = await ndSachService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, 'Đã xảy ra lỗi khi thêm sách mới'));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const ndSachService = new NoiDungSachService(MongoDB.client);
    const { masach } = req.query;
    if (!masach) {
      return next(new ApiError(500, 'masach khong hop le'));
    }
    const documents = await ndSachService.find({ masach });
    return res.send(documents);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'Lỗi truy vấn cơ sở dữ liệu'));
  }
};
