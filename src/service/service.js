import api from '@/axios';

//book
export async function _fetch_Book_List(madm) {
  if (madm) {
    console.log(madm);
    const response = await api.get(`/api/nhanvien/category?madm=${madm}`);
    console.log(response.data[0].sach_info);
    return response.data[0].sach_info;
  }
  const response = await api.get('/api/docgia/books');
  return response.data;
}

export async function _fetch_Category() {
  const res = await api.get('/api/nhanvien/category');
  return res.data;
}

export async function _fetch_Book_Detail(masach) {
  const response = await api.get('/api/docgia/books/search?masach=' + masach);
  return response.data[0];
}

//Cập nhật sách
export async function _update_book(id, payload) {
  const response = await api.put(`/api/docgia/books/${id}`);
  return response.data[0];
}

//auth
export async function _fetch_staffs() {
  const response = await api.get('/api/nhanvien/staffs');
  return response.data;
}

export async function _fetch_users() {
  const response = await api.get('/api/nhanvien/users');
  return response.data;
}

export async function _fetch_current_account() {}

export async function _register(registerForm, role) {
  try {
    console.log(registerForm, role);
    let response = [];
    if (role == 'admin') {
      console.log('Adminnnnnnnn');
      response = await api.post('/api/auth/register-admin', registerForm);
    } else response = await api.post('/api/auth/register', registerForm);
    return response.data;
  } catch (error) {
    console.error('Error add user', error);
  }
}

export async function _deleteActor(ma, role) {
  try {
    let response = [];
    if (role == 'admin') {
      response = await api.delete(`/api/nhanvien/staffs?manv=${ma}`);
    } else {
      response = await api.delete(`/api/nhanvien/users?madocgia=${ma}`);
    }
    return response;
  } catch (error) {
    console.error('Error delete user', error);
  }
}

export async function _updateActor(payload, role) {
  console.log(payload, role);
  try {
    let response = [];
    if (role == 'admin') {
      response = await api.put(`/api/nhanvien/staffs`, payload);
    } else {
      response = await api.put(`/api/nhanvien/users`, payload);
    }
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error update account!', error);
  }
  return 0;
}

//borow
export async function _borrow_history(registerForm, role) {
  const response = await api.get('/api/nhanvien/borrow', registerForm);
  console.log(response.data);
  return response.data.reverse();
}

export async function _borrow_book(madocgia, masach) {
  const response = await api.post('/api/docgia/borrow', { madocgia, masach });
  return response.data;
}

// 0: quá hạn, 1: Đang mượn, 2: đã trả, 3: đăng ký mượn, 4: mất sách.
export async function _update_borrow_status(id, data) {
  const response = await api.put(`/api/nhanvien/borrow/${id}`, data);
  console.log(response.data);
  return response.data;
}
