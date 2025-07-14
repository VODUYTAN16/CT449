const { ObjectId } = require('mongodb');

class NhaXuatBanService {
  constructor(client) {
    this.NhaXuatBan = client.db().collection('NhaXuatBan');
  }

  extractDocGiaData(payload) {
    const nhaXuatBan = {
      manxb: payload.manxb,
      tennxb: payload.tennxb,
      diachi: payload.diachi,
    };

    // remove undefined fields
    Object.keys(nhaXuatBan).forEach(
      (key) => nhaXuatBan[key] === undefined && delete nhaXuatBan[key]
    );

    return nhaXuatBan;
  }
  ///////////////////////////
  async create(payload) {
    const nxb = this.extractDocGiaData(payload);
    const result = await this.NhaXuatBan.findOneAndUpdate(
      nxb,
      { $set: nxb },
      { returnDocument: 'after', upsert: true }
    );
    return result;
  }

  async find(filter) {
    const cursor = await this.NhaXuatBan.find(filter);
    return await cursor.toArray();
  }
}
module.exports = NhaXuatBanService;
