// src/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    // Thêm các headers khác nếu cần
  },
  withCredentials: true,
});

export default api;
