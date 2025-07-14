const { ObjectId, MongoTailableCursorError } = require('mongodb');

class DanhMucService {
  constructor(client) {
    this.DanhMuc = client.db().collection('DanhMuc');
  }

  extractDanhMucData(payload) {
    const danhMuc = {
      madm: payload.madm,
      tendm: payload.tendm,
      mota: payload.mota,
      anhdm: payload.anhdm,
    };

    // remove undefined fields
    Object.keys(danhMuc).forEach(
      (key) => danhMuc[key] === undefined && delete danhMuc[key]
    );

    return danhMuc;
  }

  async find(filter) {
    const cursor = await this.DanhMuc.find(filter);
    return await cursor.toArray();
  }

  async findWithBookCount(filter = {}) {
    const cursor = await this.DanhMuc.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'Sach',
          localField: 'madm',
          foreignField: 'madm',
          as: 'sachs',
        },
      },
      {
        $addFields: {
          sosach: { $size: '$sachs' },
        },
      },
      {
        $project: {
          sachs: 0, // ẩn danh sách sách nếu không cần
        },
      },
    ]);

    return await cursor.toArray();
  }

  async findBook(madm) {
    const cursor = await this.DanhMuc.aggregate([
      { $match: { madm: madm } },
      {
        $lookup: {
          from: 'Sach',
          localField: 'madm',
          foreignField: 'madm',
          as: 'sach_info',
        },
      },
      // ❌ Không cần $unwind vì bạn muốn giữ mảng sach_info
    ]);

    return await cursor.toArray();
  }

  async createCategory(payload) {
    const danhMuc = this.extractDanhMucData(payload);

    const existingCatagory = await this.find(danhMuc.madm);
    console.log(existingCatagory.length != 0);
    if (existingCatagory.length != 0) {
      throw new Error('Danh muc da ton tai');
    }

    const result = await this.DanhMuc.insertOne(danhMuc);
    return result;
  }
}
module.exports = DanhMucService;
