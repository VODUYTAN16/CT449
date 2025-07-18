<template>
  <div class="add-book">
    <div class="container py-5">
      <div class="card shadow-lg rounded-4 p-4 border-0">
        <h2 class="mb-4 text-center fw-bold text-primary display-6">
          📚 Add New Book
        </h2>

        <form @submit.prevent="submitBook" class="row g-4">
          <!-- Book Title -->
          <div class="col-md-6">
            <label class="form-label fw-semibold">📘 Book Title *</label>
            <input
              v-model="book.tensach"
              class="form-control modern-input"
              required
            />
          </div>

          <!-- Book Code -->
          <div class="col-md-6">
            <label class="form-label fw-semibold">🔖 Book Code *</label>
            <input
              v-model="book.masach"
              class="form-control modern-input"
              required
            />
          </div>

          <!-- Author -->
          <div class="col-md-6">
            <label class="form-label fw-semibold">✍️ Author *</label>
            <input
              v-model="book.tacgia"
              class="form-control modern-input"
              required
            />
          </div>

          <!-- Publish Year -->
          <div class="col-md-6">
            <label class="form-label fw-semibold">📅 Publish Year *</label>
            <input
              v-model.number="book.namxuatban"
              type="number"
              class="form-control modern-input"
              required
            />
          </div>

          <!-- Publisher -->
          <div class="col-md-6">
            <label class="form-label fw-semibold">🏢 Publisher *</label>
            <select
              v-model="book.manxb"
              class="form-select modern-input"
              required
            >
              <option disabled value="">-- Select publisher --</option>
              <option v-for="n in nxbList" :key="n.manxb" :value="n.manxb">
                {{ n.tennxb }}
              </option>
            </select>
          </div>

          <!-- Category -->
          <div class="col-md-6">
            <label class="form-label fw-semibold">📂 Category *</label>
            <select
              v-model="book.madm"
              class="form-select modern-input"
              required
            >
              <option disabled value="">-- Select category --</option>
              <option v-for="c in categoryList" :key="c.madm" :value="c.madm">
                {{ c.tendm }}
              </option>
            </select>
          </div>

          <!-- Price -->
          <div class="col-md-4">
            <label class="form-label fw-semibold">💸 Price *</label>
            <input
              type="number"
              v-model.number="book.dongia"
              class="form-control modern-input"
              required
            />
          </div>

          <!-- Quantity -->
          <div class="col-md-4">
            <label class="form-label fw-semibold">📦 Quantity *</label>
            <input
              type="number"
              v-model.number="book.soquyen"
              class="form-control modern-input"
              required
            />
          </div>

          <!-- Page Count -->
          <div class="col-md-4">
            <label class="form-label fw-semibold">📄 Pages *</label>
            <input
              type="number"
              v-model.number="book.sotrang"
              class="form-control modern-input"
              required
            />
          </div>

          <!-- Cover Image -->
          <div class="col-12">
            <label class="form-label fw-semibold">🖼️ Cover Image</label>
            <input
              type="file"
              @change="handleImageUpload"
              class="form-control modern-input"
              accept="image/*"
            />
            <div v-if="book.anhbia" class="mt-3 text-center">
              <img
                :src="book.anhbia"
                alt="Cover"
                class="img-thumbnail shadow-sm hover-scale"
                style="max-height: 200px"
              />
            </div>
          </div>

          <!-- Description -->
          <div class="col-12">
            <label class="form-label fw-semibold">📝 Description</label>
            <textarea
              v-model="book.mota"
              class="form-control modern-input"
              rows="3"
            ></textarea>
          </div>

          <!-- Content -->
          <div class="col-12">
            <label class="form-label fw-semibold">📓 Content</label>
            <textarea
              v-model="book.noidung"
              class="form-control modern-input"
              rows="6"
              placeholder="# Book content"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="col-12 text-center mt-3">
            <button
              class="btn btn-gradient px-5 py-2 fw-semibold"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              <span v-else>🚀 Add Book</span>
            </button>
          </div>

          <!-- Message -->
          <div
            v-if="message"
            :class="[
              'mt-4 text-center fw-semibold',
              'alert',
              messageType === 'success' ? 'alert-success' : 'alert-danger',
            ]"
          >
            {{ message }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../axios';
import { marked } from 'marked';

import { _fetch_Category, _fetch_nxb } from '../service/service';

const book = reactive({
  masach: '',
  tensach: '',
  dongia: 0,
  soquyen: 1,
  namxuatban: new Date().getFullYear(),
  manxb: '',
  madm: '',
  tacgia: '',
  anhbia: '',
  mota: '',
  sotrang: 0,
  noidung: '',
});

const nxbList = ref([]);
const categoryList = ref([]);
const loading = ref(false);
const message = ref('');
const messageType = ref('');

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await api.post('/api/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log(res.data);
    book.anhbia = res.data.url; // backend trả về URL đã lưu
  } catch (error) {
    console.error('Upload ảnh thất bại:', error);
  }
};

const API_KEY = 'AIzaSyDgM8SODo__PmaaFqdRF6g3wc_1ciSPBbM'; // từ .env

const convertToMarkdown = async (text) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Chuyển nội dung sau sang HTML chuẩn từ văn bản scan của sách. Hãy nhận diện và chuyển đổi các thành phần như sau:
- Tiêu đề (ví dụ "CHAPTER I") -> <h2 align="center">...</h2>
- Đoạn văn thường -> <p>...</p>
- In nghiêng -> <em>...</em>
- Căn giữa khi cần -> dùng <div align="center">...</div>


⚠️ Quan trọng:
- **Chỉ trả về nội dung nằm bên trong thẻ <body>** (không bao gồm chính thẻ <body>).
- Không bao gồm bất kỳ phần tử <html>, <head>, hoặc <body> nào trong kết quả đầu ra.

Nội dung cần chuyển đổi:

${text}`,
              },
            ],
          },
        ],
      }),
    }
  );

  const result = await response.json();
  console.log(
    'markdown: ',
    result.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  );

  // return marked.parse(result.candidates?.[0]?.content?.parts?.[0]?.text ?? '');
  return result.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
};

// Fetch NXB và danh mục
onMounted(async () => {
  try {
    const [nxbRes, catRes] = await Promise.all([
      api.get('/api/nhanvien/nxb'),
      api.get('/api/nhanvien/category'),
    ]);
    nxbList.value = nxbRes.data;
    categoryList.value = catRes.data;
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
  }
});

const submitBook = async () => {
  loading.value = true;
  message.value = '';
  messageType.value = '';

  try {
    // Gọi Gemini để chuyển nội dung mô tả hoặc chi tiết thành Markdown
    const markdownContent = await convertToMarkdown(book.noidung);
    book.noidung = markdownContent;

    // Gửi dữ liệu sách
    await api.post('/api/nhanvien/books', {
      ...book,
    });

    // Gửi nội dung markdown
    // await api.post('/api/nhanvien/contents', {
    //   masach: book.masach,
    //   mand: 1,
    //   noidung: book.noidung,
    // });

    messageType.value = 'success';
    message.value = '✅ Thêm sách thành công!';
    resetForm();
  } catch (err) {
    console.error('Lỗi thêm sách:', err);
    messageType.value = 'error';
    message.value = '❌ Lỗi khi thêm sách!';
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  Object.assign(book, {
    masach: '',
    tensach: '',
    dongia: 0,
    soquyen: 1,
    namxuatban: new Date().getFullYear(),
    manxb: '',
    madm: '',
    tacgia: '',
    anhbia: '',
    mota: '',
    sotrang: 0,
    noidung: '',
  });
};
</script>

<style scoped>
.add-book {
  background-color: var(--organge);
  border-radius: 20px;
}
.container {
  max-width: 800px;
}
.form-label {
  font-weight: 500;
}

.btn-gradient {
  background: linear-gradient(135deg, #4f46e5, #ec4899);
  color: white;
  border: none;
  border-radius: 2rem;
  transition: all 0.3s ease;
}

.btn-gradient:hover {
  transform: scale(1.05);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
}

.modern-input {
  border-radius: 1rem;
  border: 1px solid #ccc;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.modern-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 0.2rem rgba(99, 102, 241, 0.25);
}

.hover-scale {
  transition: transform 0.3s ease;
}
.hover-scale:hover {
  transform: scale(1.05);
}
</style>
