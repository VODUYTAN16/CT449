const ApiError = require('../middleware/api-error');
const MongoDB = require('../utils/mongodb.util');
const NhaXuatBanService = require('../services/nhaxuatban.service');

exports.create = async (req, res, next) => {
  if (!req.body?.tennxb) {
    return next(new ApiError(400, 'Tên nhà xuất bản không được để trống'));
  }

  try {
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const document = await nhaXuatBanService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, 'Đã xảy ra lỗi khi thêm nhà xuất bản mới'));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    let documents = [];
    const { manxb } = req.query;
    if (manxb) {
      documents = await nhaXuatBanService.find(manxb);
    } else {
      documents = await nhaXuatBanService.find({});
    }

    return res.send(documents);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'Lỗi truy vấn cơ sở dữ liệu'));
  }
};
