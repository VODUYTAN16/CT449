import mongoose from 'mongoose';

const TheoDoiMuonSachSchema = new mongoose.Schema({
  madocgia: { type: String, ref: 'DocGia', required: true },
  masach: { type: String, ref: 'Sach', required: true },
  ngaymuon: Date,
  ngaytra: Date,
});

// eslint-disable-next-line no-undef
const TheoDoiMuonSach = mongoose.model(
  'theodoimuonsach',
  TheoDoiMuonSachSchema
);

export default TheoDoiMuonSach;
