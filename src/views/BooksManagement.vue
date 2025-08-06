<template>
  <div class="book-management">
    <div class="box"></div>
    <div class="sidebar">
      <h2 class="mb-4">📚 Book Management</h2>
      <div v-if="!addBookModal">
        <!-- Filter + Search + Add -->
        <div class="d-flex align-items-center mb-3">
          <select v-model="selectedCategory" class="form-select w-auto me-2">
            <option value="">All Categories</option>
            <option v-for="dm in categories" :key="dm.madm" :value="dm.madm">
              {{ dm.tendm }}
            </option>
          </select>

          <input
            v-model="searchQuery"
            type="text"
            class="form-control w-50"
            placeholder="Find by book title..."
          />

          <button
            class="btn btn-success ms-auto"
            data-bs-toggle="modal"
            data-bs-target="#bookModal"
            @click="toggleAddBook"
          >
            ➕ Add Book
          </button>
        </div>

        <!-- Book Table -->
        <div class="table-responsive">
          <table
            class="table table-bordered table-hover align-middle custom-table"
          >
            <thead class="table-success">
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Book Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>Year Published</th>
                <th>Publisher</th>
                <th>Quantity</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(book, index) in paginatedBooks" :key="book._id">
                <td>{{ index + 1 }}</td>
                <td><img :src="book.anhbia" alt="cover" width="50" /></td>
                <td>{{ book.tensach }}</td>
                <td>{{ book.tacgia }}</td>
                <td>{{ book.dongia }}.000 vnd</td>
                <td>{{ book.namxuatban }}</td>
                <td>{{ book.nxb_info.tennxb }}</td>
                <td>{{ book.soquyen }} books</td>
                <td class="text-center">
                  <button
                    class="btn btn-sm btn-outline-warning me-2"
                    @click="editBook(book)"
                  >
                    ✏️
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="deleteBook(book)"
                  >
                    🗑️
                  </button>
                </td>

                <!-- <td
                  v-if="filteredCategories.length == 0 || !filteredCategories"
                  class="text-center text-muted my-4"
                >
                  <i class="bi bi-book" style="font-size: 2rem"></i>
                  <div class="text-center text-danger fw-bold py-3">
                    🔍 Found Nothing!
                  </div>
                </td> -->
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="d-flex justify-content-between align-items-center mt-3">
          <small class="text-muted">
            Displaying {{ showingFrom }}–{{ showingTo }} out of
            {{ filteredBooks.length }} entries
          </small>
          <nav>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="prevPage">&laquo;</button>
              </li>
              <li
                v-for="page in visiblePages"
                :key="page"
                :class="{ active: currentPage === page }"
                class="page-item"
              >
                <button class="page-link" @click="goToPage(page)">
                  {{ page }}
                </button>
              </li>
              <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
              >
                <button class="page-link" @click="nextPage">&raquo;</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <!-- Modal thêm/sửa sách -->
      <div v-if="addBookModal">
        <button id="back" @click="toggleAddBook">
          <i
            style="z-index: 5; position: absolute"
            class="back-btn fs-2 fa-solid fa-arrow-left bg-white mx-4 px-3 py-1 rounded-pill"
          ></i>
        </button>
        <AddBook
          :bookData="selectedBook"
          :isEdit="isEditing"
          @done="handleBookSaved"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import AddBook from './AddBook.vue';
import {
  _fetch_Book_List,
  _fetch_Category,
  _delete_book,
} from '@/service/service';

const books = ref([]);
const categories = ref([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;

const addBookModal = ref(false);
const selectedBook = ref(null);
const isEditing = ref(false); // true nếu đang chỉnh sửa

const loadData = async () => {
  books.value = (await _fetch_Book_List()) || [];
  categories.value = (await _fetch_Category()) || [];
};

function removeVietnameseTones(str) {
  return str
    .normalize('NFD') // Tách ký tự và dấu
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

const filteredBooks = computed(() => {
  return books.value.filter((b) => {
    const matchTitle = removeVietnameseTones(b.tensach || '')
      .toLowerCase()
      .includes(removeVietnameseTones(searchQuery.value || '').toLowerCase());

    const matchCategory = selectedCategory.value
      ? b.madm === selectedCategory.value
      : true;
    return matchTitle && matchCategory;
  });
});

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredBooks.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() =>
  Math.ceil(filteredBooks.value.length / itemsPerPage)
);

const showingFrom = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
const showingTo = computed(() =>
  Math.min(currentPage.value * itemsPerPage, filteredBooks.value.length)
);
const visiblePages = computed(() => {
  const range = 2;
  const start = Math.max(1, currentPage.value - range);
  const end = Math.min(totalPages.value, currentPage.value + range);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const goToPage = (page) => (currentPage.value = page);
const prevPage = () => currentPage.value > 1 && currentPage.value--;
const nextPage = () =>
  currentPage.value < totalPages.value && currentPage.value++;

const toggleAddBook = () => {
  selectedBook.value = null; // reset dữ liệu sách
  isEditing.value = false;
  addBookModal.value = !addBookModal.value;
};

const editBook = (book) => {
  selectedBook.value = { ...book }; // truyền dữ liệu sách vào form
  isEditing.value = true;
  addBookModal.value = true;
};

const deleteBook = async (book) => {
  if (confirm(`Bạn có chắc muốn xóa sách "${book.tensach}"?`)) {
    await _delete_book(book);
    await loadData();
  }
};

const handleBookSaved = async () => {
  await loadData(); // Reload danh sách sách
  addBookModal.value = false; // Ẩn form
};

onMounted(loadData);
</script>

<style scoped>
.book-management {
  position: relative;
  padding: 0;
}
.box {
  position: fixed;
  top: 0;
  width: 100%;
  height: 95vh;
  border-end-start-radius: 50px;
  background-color: var(--sub-bg);
  transform: translateY(-100%);
  animation: slideDown 0.8s ease-out forwards;
}

@keyframes slideDown {
  to {
    transform: translateY(0);
  }
}

.sidebar {
  position: absolute;
  top: 5%;
  left: 5%;
  width: 90%;
}

.custom-table img {
  border-radius: 4px;
}
#back {
  border: none;
  background-color: transparent;
}

/* Bo góc toàn bộ bảng */
.custom-table {
  border-radius: 10px !important; /* Bo góc */
  overflow: hidden; /* Ẩn phần thừa khi bo góc */
  border-collapse: separate;
}

/* Màu header tùy chỉnh */
.custom-header {
  background-color: #4caf50 !important; /* Màu xanh lá đậm */
  color: white !important;
}

/* Màu hàng xen kẽ */
.custom-table tbody tr:nth-child(odd) {
  background-color: #f8f9fa; /* Màu xám nhạt */
}

.custom-table tbody tr:nth-child(even) {
  background-color: #e9f5eb; /* Màu xanh lá nhạt */
}

/* Hiệu ứng hover */
.custom-table tbody tr:hover {
  background-color: #d1e7dd !important; /* Màu xanh lá khi hover */
}

/* Viền bảng */
.custom-table,
.custom-table th,
.custom-table td {
  border: 1px solid #dee2e6 !important;
}

/* Bo góc cho header */
.custom-table thead tr:first-child th:first-child {
  border-top-left-radius: 10px !important;
}

.custom-table thead tr:first-child th:last-child {
  border-top-right-radius: 10px !important;
}

/* Bo góc cho hàng cuối */
.custom-table tbody tr:last-child td:first-child {
  border-bottom-left-radius: 10px !important;
}

.custom-table tbody tr:last-child td:last-child {
  border-bottom-right-radius: 10px !important;
}
</style>
