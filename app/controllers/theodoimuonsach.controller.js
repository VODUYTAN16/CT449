const ApiError = require('../middleware/api-error');
const MongoDB = require('../utils/mongodb.util');
const TheoDoiMuonSachService = require('../services/theodoimuonsach.service');
const DocGiaService = require('../services/docgia.service');
const SachService = require('../services/sach.service');
const config = require('../config');
const { ObjectId } = require('mongodb');

exports.create = async (req, res, next) => {
  try {
    const theoDoiMuonSach = new TheoDoiMuonSachService(MongoDB.client);
    const { masach } = req.body;
    const id = req.user.id;
    const madocgia = req.user.madocgia;
    if (!madocgia) return next(new ApiError(400, 'Không tìm thấy người dùng'));
    const document = await theoDoiMuonSach.create({
      masach,
      madocgia,
      trangthai: 3,
    });

    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'Lỗi khi tạo phiếu mượn sách'));
  }
};

exports.history = async (req, res, next) => {
  try {
    const theoDoiMuonSach = new TheoDoiMuonSachService(MongoDB.client);
    let documents = [];
    if (req.query?.madocgia) {
      documents = await theoDoiMuonSach.findByUserId(req.query?.madocgia);
    } else {
      documents = await theoDoiMuonSach.find({});
    }

    return res.send(documents);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'Lỗi truy vấn lịch sử mượn'));
  }
};

exports.update = async (req, res, next) => {
  try {
    const theoDoiMuonSach = new TheoDoiMuonSachService(MongoDB.client);
    const sach = new SachService(MongoDB.client);
    const { trangthai, ngaytra, phiphat, ngaymuon, hantra } = req.body;
    console.log(req.params.id, trangthai, ngaytra, phiphat);
    if (!trangthai) {
      return next(new ApiError(404, 'Trạng thái không được bỏ trống'));
    }
    await theoDoiMuonSach.updateFeature(req.params.id, { trangthai });
    // const ttMuonSach = await theoDoiMuonSach.find({
    //   _id: ObjectId.isValid(req.params.id) ? new ObjectId(req.params.id) : null,
    // });
    const ttMuonSach = await theoDoiMuonSach.findById(req.params.id);
    console.log(await sach.checkSL(ttMuonSach.masach));
    switch (trangthai) {
      case config.STATUS.BORROWING:
        if (!(await sach.checkSL(ttMuonSach.masach))) {
          return next(new ApiError(404, 'The books are out of stock!'));
          break;
        }
        await sach.decSLSach(ttMuonSach.masach);
        break;
      case config.STATUS.RETURNED:
        await sach.incSLSach(ttMuonSach.masach);
        break;
    }

    if (ngaytra) {
      await theoDoiMuonSach.updateFeature(req.params.id, { ngaytra });
    }
    if (phiphat) {
      await theoDoiMuonSach.updateFeature(req.params.id, { phiphat });
    }

    if (ngaymuon && hantra) {
      await theoDoiMuonSach.updateFeature(req.params.id, { ngaymuon, hantra });
    }

    return res.send({ message: 'Cập nhật trạng thái thành công' });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'Lỗi cập nhật trạng thái mượn sách'));
  }
};
