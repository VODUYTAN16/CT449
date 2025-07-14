require('dotenv').config();
const express = require('express');
const cors = require('cors');
const docGiaRouter = require('./app/routes/docgia.route');
const nhanVienRouter = require('./app/routes/nhanvien.route');
const auth = require('./app/routes/auth.route');
const danhMuc = require('./app/routes/danhmuc.route');
const authenticateToken = require('./app/middleware/auth');

const ApiError = require('./app/middleware/api-error');

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

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to contact book application.' });
});

app.use('/api/docgia', authenticateToken, docGiaRouter);
app.use('/api/nhanvien', authenticateToken, nhanVienRouter);
app.use('/api/auth', auth);
app.use('/api/nhanvien', danhMuc);

// handle 404 response
app.use((req, res, next) => {
  // Code ở đây sẽ chạy khi không có route được định nghĩa nào
  // Khớp với yêu cầu. Gọi next() để chuyển sang middleware xử lý lỗi
  return next(new ApiError(404, 'Resource not found'));
});

// define error-handling middleware last, after other app.use() and routers calls
app.use((error, req, res, next) => {
  // Middleware xử lý lỗi tập trung.
  // Trong các đoạn code xử lý ở các route, gọi next(error) sẽ chuyển về middleware xử lý lỗi này
  return res.status(error.statusCode || 500).json({
    message: error.message || 'Internal Server Error',
  });
});
module.exports = app;
