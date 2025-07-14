import mongoose from 'mongoose';

const NhanvienSchema = new mongoose.Schema({
  manv: { type: String, required: true, unique: true },
  hotennv: String,
  password: String,
  chucvu: String,
  diachi: String,
  sodienthoai: String,
});

// eslint-disable-next-line no-undef
const NhanVien = mongoose.model('nhanvien', NhanvienSchema);

export default NhanVien;
