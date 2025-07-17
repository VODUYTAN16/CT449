const { ObjectId } = require('mongodb');

class SachService {
  constructor(client) {
    this.Sach = client.db().collection('Sach');
  }

  extractSachData(payload) {
    const sach = {
      masach: payload.masach,
      tensach: payload.tensach,
      dongia: payload.dongia,
      soquyen: payload.soquyen,
      namxuatban: payload.namxuatban,
      manxb: payload.manxb,
      madm: payload.madm,
      tacgia: payload.tacgia,
      anhbia: payload.anhbia,
      mota: payload.mota,
      sotrang: payload.sotrang,
      noidung: payload.noidung,
    };

    // remove undefined fields
    Object.keys(sach).forEach(
      (key) => sach[key] === undefined && delete sach[key]
    );

    return sach;
  }

  async create(payload) {
    const book = this.extractSachData(payload);
    const result = await this.Sach.findOneAndUpdate(
      book,
      { $set: book },
      { returnDocument: 'after', upsert: true }
    );
    return result;
  }

  async find(filter) {
    const cursor = await this.Sach.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'NhaXuatBan', // Tên collection chứa nhà xuất bản
          localField: 'manxb', // Trường trong collection Sach
          foreignField: 'manxb', // Trường trong collection NhaXuatBan
          as: 'nxb_info', // Tên field chứa kết quả join
        },
      },
      {
        $unwind: {
          path: '$nxb_info',
          preserveNullAndEmptyArrays: true, // Nếu sách không có nhà xuất bản tương ứng, vẫn giữ bản ghi
        },
      },
    ]);
    return await cursor.toArray();
  }

  async findByTitle(masach) {
    return await this.find({
      masach: { $regex: new RegExp(masach), $options: 'i' },
    });
  }

  async findById(id) {
    return await this.Sach.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(masach, payload) {
    const filter = {
      masach: masach,
    };
    const update = this.extractSachData(payload);
    const result = await this.Sach.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: 'after' }
    );
    return result;
  }

  async incSLSach(masach) {
    return await this.Sach.updateOne(
      { masach: masach },
      { $inc: { soquyen: 1 } }
    );
  }

  async decSLSach(masach) {
    return await this.Sach.updateOne(
      { masach: masach },
      { $inc: { soquyen: -1 } }
    );
  }

  async checkSL(masach) {
    const sachHienTai = await this.findByTitle(masach);
    console.log(sachHienTai);
    return sachHienTai && sachHienTai[0].soquyen > 0;
  }

  async delete(id) {
    const result = await this.Sach.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}
module.exports = SachService;
