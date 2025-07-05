<template>
  <div class="borrow-history-container">
    <div class="box"></div>
    <div class="sidebar">
      <!-- Header -->
      <h1 class="mb-4">📚 Lịch Sử Mượn Sách</h1>
      <form
        class="d-flex align-items-center bg-white shadow px-4 py-2 my-2 search-bar mb-5"
      >
        <select
          v-model="statusFilter"
          class="form-select form-select-sm"
          style="border: none"
        >
          <option value="">Tất cả</option>
          <option value="Đang mượn">Đang mượn</option>
          <option value="Đã trả">Đã trả</option>
          <option value="Quá hạn">Quá hạn</option>
        </select>
        <div class="vr mx-3"></div>
        <i class="bx bx-search-big"></i>
        <input
          v-model="searchQuery"
          type="text"
          class="form-control form-control-sm"
          placeholder="Tìm kiếm..."
          style="width: 250px"
        />
      </form>

      <!-- Bảng dữ liệu -->
      <div class="table-responsive">
        <table
          class="table table-hover align-middle table-striped table-bordered custom-table"
        >
          <thead class="table-success">
            <tr>
              <th width="50">STT</th>
              <th>Tên Sách</th>
              <th>Độc Giả</th>
              <th>Ngày Mượn</th>
              <th>Hạn Trả</th>
              <th>Ngày Trả</th>
              <th>Trạng Thái</th>
              <th width="120">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in paginatedData"
              :key="item.id"
              class="custom-row"
            >
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ item.bookName }}</td>
              <td>{{ item.readerName }}</td>
              <td>{{ formatDate(item.borrowDate) }}</td>
              <td>{{ formatDate(item.dueDate) }}</td>
              <td>
                {{ item.returnDate ? formatDate(item.returnDate) : '--' }}
              </td>
              <td>
                <span :class="`badge ${getStatusClass(item.status)}`">
                  {{ item.status }}
                </span>
              </td>
              <td>
                <button
                  v-if="item.status === 'Đang mượn'"
                  @click="handleReturnBook(item.id)"
                  class="btn btn-sm btn-outline-success"
                >
                  Trả sách
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Phân trang -->
      <div class="d-flex justify-content-between align-items-center mt-3">
        <small class="text-muted">
          Hiển thị {{ showingFrom }}-{{ showingTo }} của
          {{ filteredData.length }} bản ghi
        </small>
        <nav>
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="prevPage">&laquo;</button>
            </li>
            <li
              v-for="page in visiblePages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Mock data
const mockData = ref([
  {
    id: 1,
    bookName: 'Nhà Giả Kim',
    readerName: 'Nguyễn Văn A',
    borrowDate: '2023-11-01',
    dueDate: '2023-11-15',
    returnDate: '2023-11-14',
    status: 'Đã trả',
  },
  {
    id: 2,
    bookName: 'Đắc Nhân Tâm',
    readerName: 'Trần Thị B',
    borrowDate: '2023-11-05',
    dueDate: '2023-11-19',
    returnDate: null,
    status: 'Quá hạn',
  },
  {
    id: 3,
    bookName: 'Clean Code',
    readerName: 'Lê Văn C',
    borrowDate: '2023-11-10',
    dueDate: '2023-11-24',
    returnDate: null,
    status: 'Đang mượn',
  },
  {
    id: 4,
    bookName: 'Tôi Tài Giỏi Bạn Cũng Thế',
    readerName: 'Phạm Thị D',
    borrowDate: '2023-11-12',
    dueDate: '2023-11-26',
    returnDate: null,
    status: 'Đang mượn',
  },
  {
    id: 5,
    bookName: 'Harry Potter',
    readerName: 'Hoàng Văn E',
    borrowDate: '2023-10-28',
    dueDate: '2023-11-11',
    returnDate: '2023-11-20',
    status: 'Quá hạn',
  },
  {
    id: 6,
    bookName: 'Dế Mèn Phiêu Lưu Ký',
    readerName: 'Vũ Thị F',
    borrowDate: '2023-11-15',
    dueDate: '2023-11-29',
    returnDate: null,
    status: 'Đang mượn',
  },
  {
    id: 7,
    bookName: 'Sapiens',
    readerName: 'Đặng Văn G',
    borrowDate: '2023-11-03',
    dueDate: '2023-11-17',
    returnDate: '2023-11-16',
    status: 'Đã trả',
  },
]);

// State
const searchQuery = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;

// Computed
const filteredData = computed(() => {
  return mockData.value.filter((item) => {
    const matchesSearch =
      item.bookName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.readerName.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = statusFilter.value
      ? item.status === statusFilter.value
      : true;
    return matchesSearch && matchesStatus;
  });
});

const totalPages = computed(() =>
  Math.ceil(filteredData.value.length / itemsPerPage)
);
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredData.value.slice(start, start + itemsPerPage);
});

const showingFrom = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
const showingTo = computed(() => {
  const end = currentPage.value * itemsPerPage;
  return end > filteredData.value.length ? filteredData.value.length : end;
});

const visiblePages = computed(() => {
  const range = 2;
  const start = Math.max(1, currentPage.value - range);
  const end = Math.min(totalPages.value, currentPage.value + range);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// Methods
const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('vi-VN') : '--';

const getStatusClass = (status) => {
  return {
    'Đã trả': 'bg-success',
    'Đang mượn': 'bg-warning text-dark',
    'Quá hạn': 'bg-danger',
  }[status];
};

const handleReturnBook = (id) => {
  const book = mockData.value.find((item) => item.id === id);
  if (book) {
    book.returnDate = new Date().toISOString().split('T')[0];
    book.status = 'Đã trả';
  }
};

const goToPage = (page) => (currentPage.value = page);
const prevPage = () => currentPage.value > 1 && currentPage.value--;
const nextPage = () =>
  currentPage.value < totalPages.value && currentPage.value++;
</script>

<style scoped>
.box {
  height: 85vh;
  border-end-start-radius: 80px;
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
.borrow-history-container {
  position: relative;
}

.table th {
  white-space: nowrap;
  font-weight: 500;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
}

.form-control:focus {
  border-color: transparent; /* hoặc một màu khác */
  box-shadow: none;
  outline: none;
}
.form-control {
  border-color: transparent; /* hoặc một màu khác */
  box-shadow: none;
  outline: none;
}

.form-select:focus {
  border-color: transparent; /* hoặc một màu khác */
  box-shadow: none;
  outline: none;
}

form {
  border-radius: 5px;
  font-size: 25px;
  width: fit-content;
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
