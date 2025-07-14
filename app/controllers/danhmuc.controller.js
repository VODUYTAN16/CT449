const ApiError = require('../middleware/api-error');
const MongoDB = require('../utils/mongodb.util');

const DanhMucService = require('../services/danhmuc.servive');

exports.create = async (req, res, next) => {
  if (!req.body?.tendm) {
    return next(new ApiError(400, 'Tên danh mục không được để trống'));
  }

  try {
    const danhMucService = new DanhMucService(MongoDB.client);
    const document = await danhMucService.createCategory(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'Đã xảy ra lỗi khi thêm danh muc mới'));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const danhMucService = new DanhMucService(MongoDB.client);
    let documents = [];
    const { madm } = req.query;
    if (madm) {
      documents = await danhMucService.findBook(madm);
    } else {
      documents = await danhMucService.findWithBookCount({});
    }

    return res.send(documents);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'Lỗi truy vấn cơ sở dữ liệu'));
  }
};
