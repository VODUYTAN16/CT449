<template>
  <div class="borrow-history-container">
    <div class="box"></div>
    <div class="sidebar">
      <!-- Header -->
      <h1 class="mb-4">📚 Book Borrowing History</h1>

      <form
        class="d-flex align-items-center bg-white shadow px-4 py-2 my-2 search-bar mb-5"
      >
        <select
          v-model="statusFilter"
          class="form-select form-select-sm"
          style="border: none"
        >
          <option value="">All</option>
          <option value="1">Borrowing</option>
          <option value="2">Returned</option>
          <option value="0">Overdue</option>
          <option value="3">Requested</option>
        </select>
        <div class="vr mx-3"></div>
        <i class="bx bx-search-big"></i>
        <input
          v-model="searchQuery"
          type="text"
          class="form-control form-control-sm"
          placeholder="Search by name"
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
              <th width="50">No.</th>
              <th>Book Title</th>
              <th>Reader</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Penalty Fee</th>
              <th width="120">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in paginatedData"
              :key="item.id"
              class="custom-row"
            >
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ item.sach_info?.tensach }}</td>
              <td>
                {{ item.docgia_info?.holot + ' ' + item.docgia_info?.ten }}
              </td>
              <td>{{ formatDate(item.ngaymuon) }}</td>
              <td>{{ formatDate(item.hantra) }}</td>
              <td>
                {{ item.ngaytra ? formatDate(item.ngaytra) : '--' }}
              </td>
              <td>
                <span :class="`badge ${getStatusClass(item.trangthai)}`">
                  {{ getStatusLabel(item.trangthai) }}
                </span>
              </td>
              <td>
                <span v-if="item.phiphat > 0"
                  >{{ item.phiphat.toLocaleString() }} vnd</span
                >
                <span v-else>--</span>
              </td>

              <td>
                <button
                  v-if="item.trangthai === 1 || item.trangthai === 0"
                  @click="handleReturnBook(item._id)"
                  class="btn btn-sm btn-outline-success"
                >
                  Trả sách
                </button>

                <button
                  v-if="item.trangthai === 3"
                  @click="handleApproveRequest(item._id)"
                  class="btn btn-sm btn-outline-primary"
                >
                  Duyệt
                </button>
              </td>
            </tr>
            <tr v-if="paginatedData.length === 0">
              <td :colspan="9" class="text-center text-danger fw-bold py-3">
                🔍 Found Nothing!
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Phân trang -->
      <div class="d-flex justify-content-between align-items-center mt-3">
        <small class="text-muted">
          Displaying {{ showingFrom }}–{{ showingTo }} out of
          {{ filteredData.length }} entries
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
import { ref, computed, onMounted } from 'vue';
import { _borrow_history, _update_borrow_status } from '@/service/service';

// Trạng thái mượn
const STATUS = {
  OVERDUE: 0,
  BORROWING: 1,
  RETURNED: 2,
  REQUESTED: 3,
};

// State
const borrowHistory = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;

// Format ngày
const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('vi-VN') : '--';

// Tính toán dữ liệu lọc theo search + trạng thái
// Hàm loại bỏ dấu tiếng Việt
function removeVietnameseTones(str) {
  return str
    .normalize('NFD') // Tách dấu ra khỏi ký tự
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
    .replace(/đ/g, 'd') // chuyển đ -> d
    .replace(/Đ/g, 'D');
}

const filteredData = computed(() => {
  const search = removeVietnameseTones(searchQuery.value).toLowerCase();

  return borrowHistory.value.filter((item) => {
    const bookName = removeVietnameseTones(
      item.sach_info?.tensach || ''
    ).toLowerCase();
    const readerName = removeVietnameseTones(
      `${item.docgia_info?.holot || ''} ${item.docgia_info?.ten || ''}`
    ).toLowerCase();

    const matchesSearch =
      bookName.includes(search) || readerName.includes(search);

    const matchesStatus =
      statusFilter.value !== ''
        ? item.trangthai === parseInt(statusFilter.value)
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

// Cập nhật trạng thái nếu quá hạn hoặc có phí phạt
const checkAndUpdateOverdue = () => {
  const today = new Date();
  borrowHistory.value.forEach((item) => {
    const borrowDate = new Date(item.ngaymuon);
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 14); // giả định 14 ngày mượn

    if (item.trangthai === STATUS.BORROWING && today > dueDate) {
      item.trangthai = STATUS.OVERDUE;
    }

    if (
      (item.trangthai === STATUS.OVERDUE ||
        item.trangthai === STATUS.RETURNED) &&
      item.ngaytra
    ) {
      const returnDate = new Date(item.ngaytra);
      if (returnDate > dueDate) {
        const diff = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
        item.phiPhat = diff * 10000;
      } else {
        item.phiPhat = 0;
      }
    }
  });
};

// Duyệt mượn sách
const handleApproveRequest = async (id) => {
  const item = borrowHistory.value.find((i) => i._id === id);
  if (!item) return;

  const today = new Date();
  const borrowDateStr = today.toISOString().split('T')[0];
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 14);
  const dueDateStr = dueDate.toISOString().split('T')[0];

  try {
    await _update_borrow_status(id, {
      trangthai: STATUS.BORROWING,
      ngaymuon: borrowDateStr,
      hantra: dueDateStr,
    });

    item.trangthai = STATUS.BORROWING;
    item.ngaymuon = borrowDateStr;
    item.hantra = dueDateStr;
  } catch (err) {
    console.error('Failed to approve request:', err);
    alert('Failed to approve borrow request.');
  }
};

// Trả sách
const handleReturnBook = async (id) => {
  const item = borrowHistory.value.find((i) => i._id === id);
  if (!item) return;

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const borrowDate = new Date(item.ngaymuon);
  const dueDate = new Date(borrowDate);
  dueDate.setDate(dueDate.getDate() + 14);

  let penalty = 0;
  if (today > dueDate) {
    const diffDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
    penalty = diffDays * 10000;
    alert(`Trả trễ ${diffDays} ngày. Phí phạt: ${penalty.toLocaleString()} đ`);
  }

  try {
    await _update_borrow_status(id, {
      trangthai: STATUS.RETURNED,
      ngaytra: todayStr,
      phiphat: penalty,
    });

    item.trangthai = STATUS.RETURNED;
    item.ngaytra = todayStr;
    item.phiphat = penalty;
  } catch (err) {
    console.error('Failed to return book:', err);
    alert('Failed to return book.');
  }
};

// Hiển thị nhãn trạng thái
const getStatusLabel = (code) =>
  ['Overdue', 'Borrowing', 'Returned', 'Requested'][code];

// CSS tương ứng với trạng thái
const getStatusClass = (code) =>
  ['bg-danger', 'bg-warning text-dark', 'bg-success', 'bg-info'][code];

// Phân trang
const goToPage = (page) => (currentPage.value = page);
const prevPage = () => currentPage.value > 1 && currentPage.value--;
const nextPage = () =>
  currentPage.value < totalPages.value && currentPage.value++;

// Load dữ liệu khi mounted
onMounted(async () => {
  try {
    const res = await _borrow_history();
    borrowHistory.value = res;
    checkAndUpdateOverdue();
  } catch (error) {
    console.error('Failed to load borrow history:', error);
  } finally {
    isLoading.value = false;
  }
});
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
