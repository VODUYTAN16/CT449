import mongoose from 'mongoose';

const DocGiaSchema = new mongoose.Schema({
  madocgia: { type: String, required: true, unique: true },
  holot: String,
  ten: String,
  ngaysinh: Date,
  Phai: String,
  diachi: String,
  dienthoai: String,
});

// eslint-disable-next-line no-undef
const DocGia = mongoose.model('docgia', DocGiaSchema);

export default DocGia;
