<template>
  <div class="container user-management">
    <div class="box"></div>
    <div class="sidebar">
      <h2>👥 Quản Lý Người Dùng</h2>

      <!-- Bộ lọc và tìm kiếm -->
      <div class="d-flex align-items-center mb-3">
        <select v-model="role" class="form-select w-auto me-2">
          <option value="user">Độc giả</option>
          <option value="admin">Nhân viên</option>
        </select>

        <input
          v-model="searchQuery"
          type="text"
          class="form-control w-50"
          placeholder="Tìm theo tên..."
        />

        <!-- Button trigger modal -->
        <button
          type="button"
          class="btn btn-success ms-auto"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          @click="openForm"
        >
          ➕ Thêm {{ role }}
        </button>
      </div>

      <!-- Bảng -->
      <div class="table-responsive">
        <table
          class="table table-hover align-middle table-striped table-bordered custom-table"
        >
          <thead class="table-success">
            <tr>
              <th class="text-center">#</th>
              <th>Họ Tên</th>
              <th>Ngày Sinh</th>
              <th>Phái</th>
              <th>Điện Thoại</th>
              <th>Địa Chỉ</th>
              <th class="text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td class="text-center">{{ index + 1 }}</td>
              <td>
                {{
                  role === 'user' ? item.holot + ' ' + item.ten : item.hotennv
                }}
              </td>
              <td>{{ item.ngaysinh }}</td>
              <td>{{ item.phai }}</td>
              <td>{{ item.dienthoai }}</td>
              <td>{{ item.diachi }}</td>
              <td class="text-center">
                <!-- Button trigger modal -->
                <button
                  type="button"
                  class="btn btn-sm btn-outline-warning me-1"
                  @click="editUser(item)"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  ✏️ Sửa
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="deleteUser(item)"
                >
                  🗑️ Xoá
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Phân trang -->
      <div class="d-flex justify-content-between align-items-center mt-3">
        <small class="text-muted">
          Displaying {{ showingFrom }}–{{ showingTo }} out of
          {{ filteredList.length }} entries
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

      <!-- Modal -->
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title" id="exampleModalLabel">
                {{ editMode ? '✏️ Sửa' : '➕ Thêm' }}
                {{ role === 'user' ? 'Độc Giả' : 'Nhân Viên' }}
              </h4>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="submitForm" class="p-1">
                <div class="row g-3">
                  <div class="col-md-6" v-if="role === 'user'">
                    <label class="form-label">Họ lót</label>
                    <input class="form-control" v-model="form.holot" required />
                  </div>

                  <div class="col-md-6" v-if="role === 'user'">
                    <label class="form-label">Tên</label>
                    <input class="form-control" v-model="form.ten" required />
                  </div>

                  <div class="col-md-12" v-if="role === 'admin'">
                    <label class="form-label">Họ tên nhân viên</label>
                    <input
                      class="form-control"
                      v-model="form.hotennv"
                      required
                    />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">Điện thoại</label>
                    <input
                      class="form-control"
                      v-model="form.dienthoai"
                      required
                    />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">Địa chỉ</label>
                    <input
                      class="form-control"
                      v-model="form.diachi"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Phái</label>
                    <select v-model="form.phai" class="form-select" required>
                      <option value="">-- Select Gender --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">Ngày sinh</label>
                    <input
                      type="date"
                      class="form-control"
                      v-model="form.ngaysinh"
                      required
                    />
                  </div>

                  <!-- Hiển thị chỉ khi đang thêm mới -->
                  <div class="col-md-6" v-if="!editMode">
                    <label class="form-label">Mật khẩu</label>
                    <div class="position-relative">
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        class="form-control pe-5"
                        v-model="form.matkhau"
                        required
                      />
                      <i
                        :class="showPassword ? 'bx bx-eye-slash' : 'bx bx-eye'"
                        @click="showPassword = !showPassword"
                        class="position-absolute end-0 top-50 translate-middle-y me-3"
                        style="cursor: pointer; font-size: 20px"
                      ></i>
                    </div>
                  </div>

                  <div class="col-md-6" v-if="!editMode">
                    <label class="form-label">Nhập lại mật khẩu</label>
                    <div class="position-relative">
                      <input
                        type="password"
                        class="form-control pe-5"
                        v-model="form.repassword"
                        required
                      />
                    </div>
                  </div>

                  <div class="col-12 text-end mt-3">
                    <button class="btn btn-success me-2" type="submit">
                      Lưu
                    </button>
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Huỷ
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import {
  _fetch_users,
  _fetch_staffs,
  _register,
  _updateActor,
  _deleteActor,
} from '@/service/service';

const showPassword = ref(false);
const role = ref('user');
const searchQuery = ref('');
const userList = ref([]);
const showForm = ref(false);
const editMode = ref(false);
const form = ref({
  holot: '',
  ten: '',
  hotennv: '',
  dienthoai: '',
  diachi: '',
  phai: '',
  ngaysinh: '',
  matkhau: '',
  repassword: '',
});

const resetForm = () => {
  form.value = {
    holot: '',
    ten: '',
    hotennv: '',
    dienthoai: '',
    diachi: '',
    phai: '',
    ngaysinh: '',
    matkhau: '',
    repassword: '',
  };
};

const openForm = () => {
  resetForm();
  editMode.value = false;
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
};

const loadData = async () => {
  const res =
    role.value === 'user' ? await _fetch_users() : await _fetch_staffs();
  userList.value = res || [];
};

const filteredList = computed(() => {
  return userList.value.filter((u) => {
    const name = role.value === 'user' ? u.holot + ' ' + u.ten : u.hotennv;
    return name.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const currentPage = ref(1);
const itemsPerPage = 5;

const totalPages = computed(() =>
  Math.ceil(filteredList.value.length / itemsPerPage)
);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredList.value.slice(start, start + itemsPerPage);
});

const showingFrom = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
const showingTo = computed(() => {
  const end = currentPage.value * itemsPerPage;
  return end > filteredList.value.length ? filteredList.value.length : end;
});

const visiblePages = computed(() => {
  const range = 2;
  const start = Math.max(1, currentPage.value - range);
  const end = Math.min(totalPages.value, currentPage.value + range);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// Phân trang
const goToPage = (page) => (currentPage.value = page);
const prevPage = () => currentPage.value > 1 && currentPage.value--;
const nextPage = () =>
  currentPage.value < totalPages.value && currentPage.value++;

const submitForm = async () => {
  try {
    const payload =
      role.value === 'user'
        ? {
            madocgia: form.value.madocgia,
            holot: form.value.holot,
            ten: form.value.ten,
            diachi: form.value.diachi,
            dienthoai: form.value.dienthoai,
            matkhau: form.value.matkhau,
            ngaysinh: form.value.ngaysinh,
            phai: form.value.phai,
          }
        : {
            manv: form.value.manv,
            hotennv: form.value.hotennv,
            diachi: form.value.diachi,
            dienthoai: form.value.dienthoai,
            chucvu: form.value.chucvu,
            matkhau: form.value.matkhau,
            ngaysinh: form.value.ngaysinh,
            phai: form.value.phai,
          };

    if (editMode.value) {
      const response = await _updateActor(payload, role.value);
      if (response) {
        alert('Update Account successfully!');
      } else {
        alert('Update Fail! ');
      }
    } else {
      if (!editMode.value && form.value.matkhau !== form.value.repassword) {
        return alert('Mật khẩu không khớp.');
      }

      const response = await _register(payload, role.value);
      console.log(response);
      if (response) {
        alert('Create Account successfully!');
      } else {
        alert('Account have existed! ');
      }
    }

    await loadData();
    showForm.value = false;
  } catch (err) {
    console.error(err);
    alert('Có lỗi xảy ra.');
  }
};

const editUser = (item) => {
  editMode.value = true;
  showForm.value = true;
  if (role.value === 'user') {
    form.value = {
      madocgia: item.madocgia,
      holot: item.holot,
      ten: item.ten,
      diachi: item.diachi,
      dienthoai: item.dienthoai,
      matkhau: item.matkhau || '',
      ngaysinh: item.ngaysinh,
      phai: item.phai,
    };
  } else {
    form.value = {
      manv: item.manv,
      hotennv: item.hotennv,
      chucvu: item.chucvu,
      diachi: item.diachi,
      dienthoai: item.dienthoai,
      matkhau: item.matkhau || '',
      ngaysinh: item.ngaysinh,
      phai: item.phai,
    };
  }
};

const deleteUser = async (item) => {
  const ma = role.value === 'user' ? item.madocgia : item.manv;
  if (confirm(`Xoá ${role.value} ${ma}?`)) {
    const res = await _deleteActor(ma, role.value);
    if (res) {
      alert('Delete Account successfully!');
    } else {
      alert('Error delete Account!');
    }
    await loadData();
  }
};

onMounted(loadData);
watch(role, loadData);
</script>

<style scoped>
.user-management {
  position: relative;
}
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

.custom-table {
  border-collapse: separate;
  /* border-spacing: 1px; */
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.custom-table thead {
  background-color: #d1e7dd; /* Màu xanh nhạt */
}

.custom-table tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}

.custom-table tbody tr:nth-child(even) {
  background-color: #eef7f1;
}

.custom-table tbody tr:hover {
  background-color: #dff5e1;
  transition: background-color 0.2s;
}

/* Viền bảng */
.custom-table,
.custom-table th,
.custom-table td {
  border: 1px solid #dee2e6 !important;
}

.btn-sm {
  font-size: 0.8rem;
}
</style>
