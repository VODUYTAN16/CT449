import mongoose from 'mongoose';

const NhaXuatBanSchema = new mongoose.Schema({
  manxb: { type: String, required: true, unique: true },
  tennxb: String,
  diachi: String,
});

const NhaXuatBan = mongoose.model('NhaXuatBan', NhaXuatBanSchema);

export default NhaXuatBan;
