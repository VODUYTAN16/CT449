const { ObjectId } = require('mongodb');

class NhanVienService {
  constructor(client) {
    this.NhanVien = client.db().collection('NhanVien');
  }

  extractNhanVienData(payload) {
    const nhanVien = {
      manv: payload.manv,
      hotennv: payload.hotennv,
      matkhau: payload.matkhau,
      chucvu: payload.chucvu,
      diachi: payload.diachi,
      dienthoai: payload.dienthoai,
      phai: payload.phai,
      ngaysinh: payload.ngaysinh,
      daxoa: payload.daxoa,
    };

    // remove undefined fields
    Object.keys(nhanVien).forEach(
      (key) => nhanVien[key] === undefined && delete nhanVien[key]
    );

    return nhanVien;
  }

  async findAdminByPhone(dienthoai) {
    return await this.NhanVien.findOne({ dienthoai });
  }

  async softDelete(manv) {
    const parsedId = !isNaN(manv) ? Number(manv) : manv;

    const result = await this.NhanVien.findOneAndUpdate(
      { manv: parsedId },
      { $set: { daxoa: true } },
      { returnDocument: 'after' }
    );
    console.log(result);
    return result;
  }

  async update(payload) {
    const result = await this.NhanVien.findOneAndUpdate(
      { manv: payload.manv },
      { $set: payload },
      { returnDocument: 'after' }
    );
    console.log(result);
    return result;
  }

  async findAdminById(id) {
    return await this.NhanVien.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async find(filter) {
    const cursor = await this.NhanVien.find(filter);
    return await cursor.toArray();
  }

  async createUser(payload) {
    const user = this.extractNhanVienData(payload);

    // Kiểm tra số điện thoại đã tồn tại
    const existingUser = await this.findAdminByPhone(user.dienthoai);
    console.log(existingUser);
    if (existingUser) {
      throw new Error('Số điện thoại đã được đăng ký');
    }

    const result = await this.NhanVien.insertOne(user);
    return result;
  }
}
module.exports = NhanVienService;
