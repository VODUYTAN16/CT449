const { ObjectId } = require('mongodb');

class NoiDungSachService {
  constructor(client) {
    this.NoiDungSach = client.db().collection('NoiDungSach');
  }

  extractNoiDungSachData(payload) {
    const noiDungSach = {
      masach: payload.masach,
      mand: payload.mand,
      noidung: payload.noidung,
    };

    // remove undefined fields
    Object.keys(noiDungSach).forEach(
      (key) => noiDungSach[key] === undefined && delete noiDungSach[key]
    );

    return noiDungSach;
  }
  /// Cac phuong thuc
  async find(filter) {
    const cursor = await this.NoiDungSach.find(filter);
    return await cursor.toArray();
  }

  async create(payload) {
    const bookPage = this.extractNoiDungSachData(payload);
    const result = await this.NoiDungSach.findOneAndUpdate(
      bookPage,
      { $set: bookPage },
      { returnDocument: 'after', upsert: true }
    );
    return result;
  }
}
module.exports = NoiDungSachService;
