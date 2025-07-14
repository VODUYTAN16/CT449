import mongoose from 'mongoose';

const SachSchema = new mongoose.Schema({
  masach: { type: String, required: true, unique: true },
  tensach: { type: String, required: true },
  dongia: Number,
  soquyen: Number,
  namxuatban: Number,
  manxb: { type: String, ref: 'NhaXuatBan' },
  tacgia: String,
  anhbia: String,
  mota: String,
});

// eslint-disable-next-line no-undef
const Sach = mongoose.model('Sach', SachSchema);

export default Sach;
