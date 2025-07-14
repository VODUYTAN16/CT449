<template>
  <div class="container mt-5">
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

      <button class="btn btn-success ms-auto" @click="openForm">
        ➕ Thêm {{ role }}
      </button>
    </div>

    <!-- Bảng -->
    <table class="table table-bordered">
      <thead class="table-success">
        <tr>
          <th>#</th>
          <th v-if="role === 'user'">Mã Độc Giả</th>
          <th v-if="role === 'admin'">Mã Nhân Viên</th>
          <th>Họ Tên</th>
          <th>Điện Thoại</th>
          <th>Địa Chỉ</th>
          <th>Thao Tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredList" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ role === 'user' ? item.madocgia : item.manv }}</td>
          <td>
            {{ role === 'user' ? item.holot + ' ' + item.ten : item.hotennv }}
          </td>
          <td>{{ item.dienthoai }}</td>
          <td>{{ item.diachi }}</td>
          <td>
            <button class="btn btn-sm btn-warning" @click="editUser(item)">
              Sửa
            </button>
            <button class="btn btn-sm btn-danger" @click="deleteUser(item)">
              Xoá
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Thêm/Sửa -->
    <div v-if="showForm" class="card p-4 shadow mt-4">
      <h5 class="mb-3">
        {{ editMode ? '✏️ Sửa' : '➕ Thêm' }}
        {{ role === 'user' ? 'Độc Giả' : 'Nhân Viên' }}
      </h5>

      <form @submit.prevent="submitForm">
        <div class="row">
          <div class="col-md-6">
            <label class="form-label">Mã {{ role }}</label>
            <input class="form-control" v-model="form.id" required />
          </div>
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
            <input class="form-control" v-model="form.hotennv" required />
          </div>
          <div class="col-md-6">
            <label class="form-label">Điện thoại</label>
            <input class="form-control" v-model="form.dienthoai" required />
          </div>
          <div class="col-md-6">
            <label class="form-label">Địa chỉ</label>
            <input class="form-control" v-model="form.diachi" required />
          </div>
          <div class="col-md-6">
            <label class="form-label">Mật khẩu</label>
            <input
              type="password"
              class="form-control"
              v-model="form.matkhau"
              required
            />
          </div>
          <div class="col-md-6" v-if="role === 'admin'">
            <label class="form-label">Chức vụ</label>
            <input class="form-control" v-model="form.chucvu" required />
          </div>
          <div class="col-12 mt-3">
            <button class="btn btn-success me-2" type="submit">Lưu</button>
            <button class="btn btn-secondary" @click="closeForm">Huỷ</button>
          </div>
        </div>
      </form>
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

const role = ref('user');
const searchQuery = ref('');
const userList = ref([]);
const showForm = ref(false);
const editMode = ref(false);
const form = ref({
  id: '',
  holot: '',
  ten: '',
  hotennv: '',
  dienthoai: '',
  diachi: '',
  matkhau: '',
  chucvu: '',
});

const resetForm = () => {
  form.value = {
    id: '',
    holot: '',
    ten: '',
    hotennv: '',
    dienthoai: '',
    diachi: '',
    matkhau: '',
    chucvu: '',
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

const submitForm = async () => {
  try {
    if (!form.value.id || !form.value.matkhau)
      return alert('Vui lòng nhập đầy đủ thông tin.');

    const payload =
      role.value === 'user'
        ? {
            madocgia: form.value.id,
            holot: form.value.holot,
            ten: form.value.ten,
            diachi: form.value.diachi,
            dienthoai: form.value.dienthoai,
            matkhau: form.value.matkhau,
            ngaysinh: '2000-01-01',
            phai: 'Nam',
          }
        : {
            manv: form.value.id,
            hotennv: form.value.hotennv,
            diachi: form.value.diachi,
            dienthoai: form.value.dienthoai,
            chucvu: form.value.chucvu,
            matkhau: form.value.matkhau,
          };

    if (editMode.value) {
      await _updateActor(payload, role.value);
    } else {
      await _register(payload, role.value);
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
      id: item.madocgia,
      holot: item.holot,
      ten: item.ten,
      diachi: item.diachi,
      dienthoai: item.dienthoai,
      matkhau: item.matkhau || '',
    };
  } else {
    form.value = {
      id: item.manv,
      hotennv: item.hotennv,
      chucvu: item.chucvu,
      diachi: item.diachi,
      dienthoai: item.dienthoai,
      matkhau: item.matkhau || '',
    };
  }
};

const deleteUser = async (item) => {
  const ma = role.value === 'user' ? item.madocgia : item.manv;
  if (confirm(`Xoá ${role.value} ${ma}?`)) {
    await _deleteActor(ma, role.value);
    await loadData();
  }
};

onMounted(loadData);
watch(role, loadData);
</script>
