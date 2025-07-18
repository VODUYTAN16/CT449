// uploadRouter.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Cấu hình lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Thư mục lưu ảnh
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

// API upload ảnh
router.post('/image', upload.single('image'), (req, res) => {
  try {
    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, url: imageUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

module.exports = router;
