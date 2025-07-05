<template>
  <div class="container mt-5">
    <h2 class="mb-4">Thêm Sách Mới</h2>
    <form @submit.prevent="submitBook">
      <!-- Tiêu đề sách -->
      <div class="mb-3">
        <label for="bookTitle" class="form-label"
          >Tiêu đề sách <span class="text-danger">*</span></label
        >
        <input
          type="text"
          class="form-control"
          id="bookTitle"
          v-model.trim="book.title"
          required
          placeholder="Nhập tiêu đề sách"
        />
      </div>

      <!-- Tác giả -->
      <div class="mb-3">
        <label for="bookAuthor" class="form-label"
          >Tác giả <span class="text-danger">*</span></label
        >
        <input
          type="text"
          class="form-control"
          id="bookAuthor"
          v-model.trim="book.author"
          required
          placeholder="Nhập tên tác giả"
        />
      </div>

      <!-- Thể loại -->
      <div class="mb-3">
        <label for="bookCategory" class="form-label"
          >Thể loại <span class="text-danger">*</span></label
        >
        <input
          type="text"
          class="form-control"
          id="bookCategory"
          v-model.trim="book.category"
          required
          placeholder="Ví dụ: Tiểu thuyết, Khoa học..."
        />
      </div>

      <!-- Mô tả -->
      <div class="mb-3">
        <label for="bookDescription" class="form-label">Mô tả</label>
        <textarea
          class="form-control"
          id="bookDescription"
          rows="3"
          v-model.trim="book.description"
          placeholder="Mô tả ngắn về nội dung sách"
        ></textarea>
      </div>

      <!-- Số lượng -->
      <div class="mb-3">
        <label for="bookQuantity" class="form-label"
          >Số lượng <span class="text-danger">*</span></label
        >
        <input
          type="number"
          class="form-control"
          id="bookQuantity"
          v-model.number="book.quantity"
          min="1"
          required
          placeholder="Số bản có sẵn"
        />
      </div>

      <!-- Hình ảnh -->
      <div class="mb-3">
        <label for="bookImage" class="form-label">URL hình ảnh</label>
        <input
          type="url"
          class="form-control"
          id="bookImage"
          v-model.trim="book.imageUrl"
          placeholder="https://example.com/book-cover.jpg"
        />
        <div class="mt-2">
          <img
            v-if="book.imageUrl"
            :src="book.imageUrl"
            alt="Book cover preview"
            class="img-thumbnail mt-2"
            style="max-height: 200px"
          />
          <div v-else class="text-muted">Chưa có hình ảnh</div>
        </div>
      </div>

      <!-- Nút submit -->
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="loading">
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Đang xử lý...
        </span>
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
import { ref, reactive } from 'vue';

const book = reactive({
  title: '',
  author: '',
  category: '',
  description: '',
  quantity: 1,
  imageUrl: '',
});

const loading = ref(false);
const message = ref('');
const messageType = ref('');

const submitBook = async () => {
  loading.value = true;
  message.value = '';
  messageType.value = '';

  try {
    // Giả lập API call - Thay bằng API thực tế của bạn
    // const response = await fetch('/api/books', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(book)
    // });

    // Giả lập delay mạng
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Giả lập kết quả thành công
    // const result = await response.json();

    messageType.value = 'success';
    message.value = 'Thêm sách thành công!';

    // Reset form sau khi thêm thành công
    Object.assign(book, {
      title: '',
      author: '',
      category: '',
      description: '',
      quantity: 1,
      imageUrl: '',
    });
  } catch (error) {
    messageType.value = 'error';
    message.value = `Lỗi khi thêm sách: ${error.message}`;
    console.error('Lỗi thêm sách:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
.form-label {
  font-weight: 500;
}
</style>
