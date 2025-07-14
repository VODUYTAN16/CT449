const { ObjectId } = require('mongodb');

class DocGiaService {
  constructor(client) {
    this.DocGia = client.db().collection('DocGia');
  }

  extractDocGiaData(payload) {
    const docGia = {
      madocgia: payload.madocgia,
      holot: payload.holot,
      ten: payload.ten,
      ngaysinh: payload.ngaysinh,
      phai: payload.phai,
      diachi: payload.diachi,
      dienthoai: payload.dienthoai,
      matkhau: payload.matkhau,
    };

    // remove undefined fields
    Object.keys(docGia).forEach(
      (key) => docGia[key] === undefined && delete docGia[key]
    );

    return docGia;
  }

  async findUserByPhone(dienthoai) {
    return await this.DocGia.findOne({ dienthoai });
  }

  async findUserById(id) {
    return await this.DocGia.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async find(filter) {
    const cursor = await this.DocGia.find(filter);
    return await cursor.toArray();
  }

  async createUser(payload) {
    const user = this.extractDocGiaData(payload);

    // Kiểm tra số điện thoại đã tồn tại
    const existingUser = await this.findUserByPhone(user.dienthoai);
    console.log(existingUser);
    if (existingUser) {
      throw new Error('Số điện thoại đã được đăng ký');
    }

    const result = await this.DocGia.insertOne(user);
    return result;
  }
}
module.exports = DocGiaService;
