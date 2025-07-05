import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import NhaXuatBan from './models/NhaXuatBan.js';
import Sach from './models/Sach.js';
import dotenv from 'dotenv';
import NhanVien from './models/NhanVien.js';
dotenv.config();
const app = express();
app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Thêm OPTIONS cho preflight
    allowedHeaders: ['Content-Type', 'Authorization'], // Thêm Authorization nếu dùng JWT
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(function (req, res, next) {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

// Ket noi mongoDB
mongoose
  .connect('mongodb://localhost:27017/htqlmuonsach', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => console.log('MongoDB connected failed', err));

app.get('/api/get_sach', (req, res) => {
  Sach.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => console.log('err get_sach, ', err));
});

app.get('/api/staff', (req, res) => {
  NhanVien.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => console.log('err get staff, ', err));
});

app.get('/api/get_sach/:masach', (req, res) => {
  const masach = req.params.masach; // Lấy mã sách từ URL

  Sach.findOne({ masach: masach }) // Tìm sách theo mã sách
    .then((data) => {
      if (data) {
        res.json(data); // Trả về sách tìm được
      } else {
        res.status(404).json({ message: 'Không tìm thấy sách' }); // Xử lý nếu không có sách
      }
    })
    .catch((err) => {
      console.log('err get_sach, ', err);
      res.status(500).json({ message: 'Lỗi server' });
    });
});

app.post('/api/seed', async (req, res) => {
  try {
    const sampleBooks = [
      {
        masach: 'S001',
        tensach: 'Lập Trình JavaScript Cơ Bản',
        anhbia:
          'https://i.pinimg.com/736x/17/d9/9a/17d99aa6329385e553094f2f1e3180b0.jpg',
        dongia: 120000,
        soquyen: 10,
        namxuatban: 2021,
        manxb: 'NXB001',
        tacgia: 'Nguyễn Văn A',
        mota: 'Nhân vật chính trong truyện là Santiago. Cha mẹ Santiago mong muốn cậu trở thành linh mục để mang lại niềm tự hào cho gia đình, nhưng vì ước mơ từ nhỏ của chính mình là đi đây đi đó khắp thế giới, Santigo đã thuyết phục được cha cậu và trở thành một người chăn cừu.',
      },
      {
        masach: 'S002',
        tensach: 'Học Node.js Từ Cơ Bản Đến Nâng Cao',
        anhbia:
          'https://i.pinimg.com/736x/d7/01/e0/d701e021fafa5045479711a102f74fb1.jpg',
        dongia: 150000,
        soquyen: 7,
        namxuatban: 2022,
        manxb: 'NXB002',
        tacgia: 'Trần Thị B',
        mota: 'Nhân vật chính trong truyện là Santiago. Cha mẹ Santiago mong muốn cậu trở thành linh mục để mang lại niềm tự hào cho gia đình, nhưng vì ước mơ từ nhỏ của chính mình là đi đây đi đó khắp thế giới, Santigo đã thuyết phục được cha cậu và trở thành một người chăn cừu.',
      },
      {
        masach: 'S003',
        tensach: 'MongoDB Thực Chiến',
        anhbia:
          'https://i.pinimg.com/736x/68/a9/8f/68a98fccc3d20317b99b36cf4e531d98.jpg',
        dongia: 135000,
        soquyen: 5,
        namxuatban: 2023,
        manxb: 'NXB001',
        tacgia: 'Lê Văn C',
        mota: 'Nhân vật chính trong truyện là Santiago. Cha mẹ Santiago mong muốn cậu trở thành linh mục để mang lại niềm tự hào cho gia đình, nhưng vì ước mơ từ nhỏ của chính mình là đi đây đi đó khắp thế giới, Santigo đã thuyết phục được cha cậu và trở thành một người chăn cừu.',
      },
      {
        masach: 'S004',
        tensach: 'ReactJS Cho Người Mới Bắt Đầu',
        anhbia:
          'https://i.pinimg.com/736x/18/d6/a1/18d6a141f6bc8e2b0af47fd8a881206c.jpg',
        dongia: 180000,
        soquyen: 8,
        namxuatban: 2020,
        manxb: 'NXB003',
        tacgia: 'Phạm Thị D',
        mota: 'Nhân vật chính trong truyện là Santiago. Cha mẹ Santiago mong muốn cậu trở thành linh mục để mang lại niềm tự hào cho gia đình, nhưng vì ước mơ từ nhỏ của chính mình là đi đây đi đó khắp thế giới, Santigo đã thuyết phục được cha cậu và trở thành một người chăn cừu.',
      },
      {
        masach: 'S005',
        tensach: 'Thuật Toán Và Cấu Trúc Dữ Liệu',
        anhbia:
          'https://i.pinimg.com/736x/83/22/35/83223560e713e41b06b8ad6026a09026.jpg',
        dongia: 200000,
        soquyen: 4,
        namxuatban: 2019,
        manxb: 'NXB002',
        tacgia: 'Đỗ Văn E',
        mota: 'Nhân vật chính trong truyện là Santiago. Cha mẹ Santiago mong muốn cậu trở thành linh mục để mang lại niềm tự hào cho gia đình, nhưng vì ước mơ từ nhỏ của chính mình là đi đây đi đó khắp thế giới, Santigo đã thuyết phục được cha cậu và trở thành một người chăn cừu.',
      },
    ];

    const listStaff = [
      {
        manv: 'NV001',
        hotennv: 'Nguyễn Văn A',
        password:
          '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq1V1zHXgD2/J9U9dGdYQ6QZtNEQeW', // Mật khẩu mã hóa (ví dụ: '123456')
        chucvu: 'Thủ thư',
        diachi: '123 Đường ABC, Quận 1, TP.HCM',
        sodienthoai: '0901234567',
      },
      {
        manv: 'NV002',
        hotennv: 'Trần Thị B',
        password:
          '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq1V1zHXgD2/J9U9dGdYQ6QZtNEQeW',
        chucvu: 'Quản lý kho sách',
        diachi: '456 Đường XYZ, Quận 2, TP.HCM',
        sodienthoai: '0987654321',
      },
      {
        manv: 'NV003',
        hotennv: 'Lê Văn C',
        password:
          '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq1V1zHXgD2/J9U9dGdYQ6QZtNEQeW',
        chucvu: 'Nhân viên hỗ trợ',
        diachi: '789 Đường LMN, Quận 3, TP.HCM',
        sodienthoai: '0912345678',
      },
    ];
    const insertedStaff = await NhanVien.insertMany(listStaff);
    const insertedBooks = await Sach.insertMany(sampleBooks);
    res.status(201).json(insertedBooks, insertedStaff);
  } catch (err) {
    console.error('Lỗi khi thêm sách:', err);
    res.status(500).json('loi khi them sach');
  }
});

// eslint-disable-next-line no-undef
app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server is running on http://${process.env.MYSQLHOST || 'localhost'}:${process.env.PORT || 3000}`
  );
});
