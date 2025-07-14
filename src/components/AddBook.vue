<template>
  <div class="container mt-5">
    <h2 class="mb-4">📚 Thêm Sách Mới</h2>

    <form @submit.prevent="submitBook">
      <!-- Tiêu đề sách -->
      <div class="mb-3">
        <label class="form-label">Tên sách *</label>
        <input v-model="book.tensach" class="form-control" required />
      </div>

      <!-- Mã sách -->
      <div class="mb-3">
        <label class="form-label">Mã sách *</label>
        <input v-model="book.masach" class="form-control" required />
      </div>

      <!-- Tác giả -->
      <div class="mb-3">
        <label class="form-label">Tác giả *</label>
        <input v-model="book.tacgia" class="form-control" required />
      </div>

      <!-- Nhà xuất bản -->
      <div class="mb-3">
        <label class="form-label">Nhà xuất bản *</label>
        <select v-model="book.manxb" class="form-select" required>
          <option disabled value="">-- Chọn nhà xuất bản --</option>
          <option v-for="n in nxbList" :key="n.manxb" :value="n.manxb">
            {{ n.tennxb }}
          </option>
        </select>
      </div>

      <!-- Danh mục -->
      <div class="mb-3">
        <label class="form-label">Danh mục *</label>
        <select v-model="book.madm" class="form-select" required>
          <option disabled value="">-- Chọn danh mục --</option>
          <option v-for="c in categoryList" :key="c.madm" :value="c.madm">
            {{ c.tendm }}
          </option>
        </select>
      </div>

      <!-- Giá và số lượng -->
      <div class="row mb-3">
        <div class="col">
          <label class="form-label">Đơn giá *</label>
          <input
            type="number"
            v-model.number="book.dongia"
            class="form-control"
            required
          />
        </div>
        <div class="col">
          <label class="form-label">Số quyển *</label>
          <input
            type="number"
            v-model.number="book.soquyen"
            class="form-control"
            required
          />
        </div>
        <div class="col">
          <label class="form-label">Năm xuất bản *</label>
          <input
            type="number"
            v-model.number="book.namxuatban"
            class="form-control"
            required
          />
        </div>
      </div>

      <!-- Hình ảnh bìa -->
      <div class="mb-3">
        <label class="form-label">URL ảnh bìa</label>
        <input v-model="book.anhbia" type="url" class="form-control" />
        <div v-if="book.anhbia" class="mt-2">
          <img
            :src="book.anhbia"
            alt="Ảnh bìa"
            class="img-thumbnail"
            style="max-height: 200px"
          />
        </div>
      </div>

      <!-- Mô tả -->
      <div class="mb-3">
        <label class="form-label">Mô tả</label>
        <textarea v-model="book.mota" class="form-control" rows="3"></textarea>
      </div>

      <!-- Số trang -->
      <div class="mb-3">
        <label class="form-label">Số trang *</label>
        <input
          v-model.number="book.sotrang"
          type="number"
          class="form-control"
          required
        />
      </div>

      <!-- Nội dung Markdown -->
      <div class="mb-3">
        <label class="form-label">Nội dung (Markdown)</label>
        <textarea
          v-model="book.noidung"
          class="form-control"
          rows="6"
          placeholder="# Nội dung sách"
        ></textarea>
      </div>

      <!-- Nút gửi -->
      <button class="btn btn-success" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm"></span>
        <span v-else>Thêm sách</span>
      </button>

      <!-- Thông báo -->
      <div
        v-if="message"
        :class="[
          'mt-3',
          'alert',
          messageType === 'success' ? 'alert-success' : 'alert-danger',
        ]"
      >
        {{ message }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../axios';

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
    // Gửi dữ liệu sách
    await api.post('/api/nhanvien/books', {
      masach: book.masach,
      tensach: book.tensach,
      dongia: book.dongia,
      soquyen: book.soquyen,
      namxuatban: book.namxuatban,
      manxb: book.manxb,
      madm: book.madm,
      tacgia: book.tacgia,
      anhbia: book.anhbia,
      mota: book.mota,
      sotrang: book.sotrang,
    });

    // Gửi nội dung sách (markdown)
    await api.post('/api/nhanvien/contents', {
      masach: book.masach,
      mand: 1, // bạn có thể truyền ID người dùng thực tế ở đây
      noidung: book.noidung,
    });

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
.container {
  max-width: 800px;
  margin-bottom: 50px;
}
.form-label {
  font-weight: 500;
}
</style>
