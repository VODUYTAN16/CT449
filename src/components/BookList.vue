<template>
  <main>
    <div class="d-flex justify-content-between align-items-center my-4">
      <h3 class="fw-bold mb-0">📚 BOOK RECOMMENDATION</h3>
      <button
        class="btn btn-light d-flex justify-content-center align-items-center btn-sm"
        @click="showAll = !showAll"
      >
        {{ showAll ? 'Hide' : 'View All' }}
        <i class="bx bx-chevron-right"></i>
      </button>
    </div>

    <div class="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-4">
      <div v-for="(book, index) in displayedBooks" :key="index" class="col">
        <div class="position-relative">
          <router-link
            :to="`/bookdetail/${book.masach}`"
            class="book text-decoration-none"
            style="max-width: fit-content"
          >
            <img
              :src="book.anhbia"
              alt="Bìa sách"
              class="img-fluid rounded shadow-sm"
              style="
                height: 300px;
                border-radius: 5px;
                box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.3);
              "
            />
          </router-link>

          <!-- Nút xóa chỉ hiển thị với admin -->
          <button
            v-if="isAdmin"
            @click="deleteBook(book)"
            class="btn btn-danger btn-sm position-absolute me-3"
            style="top: 5px; right: 5px; z-index: 2"
            title="Xóa sách"
          >
            <i class="bx bx-x"></i>
          </button>
        </div>
      </div>
      <div
        v-if="!displayedBooks || displayedBooks.length === 0"
        class="text-center text-muted my-4"
      >
        <i class="bi bi-book" style="font-size: 2rem"></i>
        <div class="text-center text-danger fw-bold py-3">
          🔍 Found Nothing!
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { _fetch_current_account, _delete_book } from '@/service/service';

const props = defineProps({
  book_list: {
    type: Array,
    required: true,
  },
});

const showAll = ref(false);
const isAdmin = ref(false);

const displayedBooks = computed(() => {
  return showAll.value ? props.book_list : props.book_list.slice(0, 5);
});

const fetchAccount = async () => {
  try {
    const account = await _fetch_current_account();
    isAdmin.value = account?.role === 'admin';
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
  }
};

const deleteBook = async (book) => {
  if (confirm('Are you sure to delete this book?')) {
    try {
      await _delete_book(book);
      alert('Delete book successfully');
      window.location.reload(); // báo cha reload danh sách
    } catch (error) {
      console.error('Lỗi khi xóa sách:', error);
    }
  }
};

onMounted(() => {
  fetchAccount();
});
</script>

<style scoped>
.book {
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  display: block;
}
.book:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}
</style>
