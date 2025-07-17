const { ObjectId } = require('mongodb');

class TheoDoiMuonSachService {
  constructor(client) {
    this.TheoDoiMuonSach = client.db().collection('TheoDoiMuonSach');
  }

  extractTheoDoiMuonSachData(payload) {
    const theoDoiMuonSach = {
      madocgia: payload.madocgia,
      masach: payload.masach,
      ngaymuon: payload.ngaymuon,
      ngaytra: payload.ngaytra,
      hantra: payload.hantra,
      trangthai: payload.trangthai,
      phiphat: payload.phiphat,
      quahan: payload.quahan,
    };

    // remove undefined fields
    Object.keys(theoDoiMuonSach).forEach(
      (key) => theoDoiMuonSach[key] === undefined && delete theoDoiMuonSach[key]
    );

    return theoDoiMuonSach;
  }

  async create(payload) {
    const borrow = this.extractTheoDoiMuonSachData(payload);
    const result = await this.TheoDoiMuonSach.insertOne(borrow);
    return result;
  }

  async find(filter) {
    const cursor = await this.TheoDoiMuonSach.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'Sach',
          localField: 'masach',
          foreignField: 'masach',
          as: 'sach_info',
        },
      },
      {
        $lookup: {
          from: 'NhanVien',
          localField: 'manv',
          foreignField: 'manv',
          as: 'nv_info',
        },
      },
      {
        $lookup: {
          from: 'DocGia',
          localField: 'madocgia',
          foreignField: 'madocgia',
          as: 'docgia_info',
        },
      },

      {
        $unwind: {
          path: '$sach_info',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$nv_info',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$docgia_info',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return await cursor.toArray();
  }

  async findByUserId(madocgia) {
    return await this.find({
      madocgia: madocgia,
    });
  }

  async findById(id) {
    return await this.TheoDoiMuonSach.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async updateFeature(id, feature) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const result = await this.TheoDoiMuonSach.findOneAndUpdate(
      filter,
      { $set: feature },
      { returnDocument: 'after' }
    );
    return result;
  }
}

module.exports = TheoDoiMuonSachService;
