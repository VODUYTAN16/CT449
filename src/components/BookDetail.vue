<template>
  <main class="bookdetail">
    <router-link to="/" class="back-btn fs-2">
      <i
        class="fa-solid fa-arrow-left bg-white mx-4 px-3 py-1 rounded-pill"
        style=""
      ></i>
    </router-link>
    <div class="d-flex justify-content-center inf-head">
      <img
        :src="book.anhbia"
        alt=""
        style="
          height: 350px;
          border-radius: 5px;
          box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.3);
        "
      />
      <div class="mx-5">
        <div>
          <h2>{{ book.tensach }}</h2>
          <h6>{{ book.tacgia }}</h6>
          <h6>Publication Year: {{ book.namxuatban }}</h6>
        </div>
      </div>
    </div>

    <div class="row gx-5 inf-bot px-5">
      <div class="col-12 d-flex flex-column align-items-center ms-5">
        <button
          class="btn bg-success text-white mt-3"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          style="z-index: 10; position: relative; max-width: fit-content"
        >
          Borrow Book
        </button>
        <button
          class="btn bg-success text-white mt-3"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#bookcontent"
          style="z-index: 10; position: relative; max-width: fit-content"
        >
          <i class="bx bx-reading"></i> Read Book
        </button>
      </div>
      <!-- Description -->
      <div class="col-md-6 mb-4 px-5">
        <h5 class="fw-bold mb-3">Description</h5>
        <p class="text-muted" style="text-align: justify">{{ book.mota }}</p>
      </div>
      <!-- Additional Info -->
      <div
        class="col-md-6 px-5"
        style="border-left: 1px solid rgba(0, 0, 0, 0.3)"
      >
        <div class="row justify-content-bet">
          <div class="col-md-5 mb-4">
            <h5 class="fw-bold mb-2">Language</h5>
            <p class="text-muted mb-4">Standard Vietnamese</p>

            <h5 class="fw-bold mb-2">Price</h5>
            <p class="text-muted">{{ book.dongia }} VND</p>
          </div>

          <div class="col mb-4">
            <h5 class="fw-bold mb-2">Paperback</h5>
            <p class="text-muted mb-2">Paper texture, full colour, 345 pages</p>
            <p class="text-muted">Book code: {{ book.masach }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              THÔNG TIN MƯỢN SÁCH
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3 row">
                <label class="col-sm-3 col-form-label">Full of name:</label>
                <div class="col-sm-9">
                  <input
                    v-model="formData.readerId"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>
              </div>

              <div class="mb-3 row">
                <label class="col-sm-3 col-form-label">Mã sách:</label>
                <div class="col-sm-9">
                  <input
                    v-model="formData.bookId"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>
              </div>

              <div class="mb-3 row">
                <label class="col-sm-3 col-form-label">Borrow Date:</label>
                <div class="col-sm-9">
                  <input
                    v-model="formData.borrowDate"
                    type="date"
                    class="form-control"
                    required
                    disabled
                  />
                </div>
              </div>

              <div class="mb-3 row">
                <label class="col-sm-3 col-form-label">Return Date:</label>
                <div class="col-sm-9">
                  <input
                    v-model="formData.returnDate"
                    type="date"
                    class="form-control"
                    required
                  />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" class="btn btn-primary" @click="submitForm">
              Xác nhận mượn
            </button>
          </div>
        </div>
      </div>
    </div>
    <BookPage :book="book"></BookPage>
  </main>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import BookPage from './BookPage.vue';
import api from '../axios.js';

// // Data
// const modal = ref(null);
// let modalInstance = null;
const formData = ref({
  readerId: '',
  bookId: '',
  borrowDate: new Date().toISOString().split('T')[0], // Mặc định là ngày hiện tại
  returnDate: new Date(),
  staffId: '',
});
const staffList = ref([]);

// // Methods
// const openModal = () => {
//   modalInstance.show();
// };

// const closeModal = () => {
//   modalInstance.hide();
// };

const submitForm = async () => {
  try {
    const response = await api.post('/api/borrow', formData.value);
    alert('Borrow book successfully !');
    // closeModal();
    resetForm();
  } catch (error) {
    console.error('Lỗi khi mượn sách:', error);
    alert(
      'Fail borrow book: ' + error.response?.data?.message || error.message
    );
  }
};

const resetForm = () => {
  formData.value = {
    readerId: '',
    bookId: '',
    borrowDate: new Date().toISOString().split('T')[0],
    returnDate: new Date(),
    staffId: '',
  };
};

const route = useRoute();
const book = ref({
  masach: String,
  tensach: String,
  dongia: Number,
  soquyen: Number,
  namxuatban: Number,
  manxb: String,
  tacgia: String,
  anhbia: String,
  mota: String,
});

const _fetch_Book = async (masach) => {
  const response = await api.get('/api/docgia/books/search?masach=' + masach);
  return response.data[0];
};

onMounted(async () => {
  const masach = route.params.masach;
  book.value = await _fetch_Book(masach);
  console.log(book.value);

  // api.get('api/staff').then((response) => {
  //   staffList.value = response.data;
  //   console.log(staffList.value);
  // });
});
</script>

<style>
/* .giasach {
  height: 30%;
  width: 100%;
  position: absolute;
  bottom: -50px;
  background-color: var(--sub-bg);
  border-top-left-radius: 10px;
  box-shadow: -15px 8px 15px rgba(0, 0, 0, 0.15);
} */

.bookdetail {
  background-color: var(--sub-bg);
  min-height: 100vh;
  overflow: hidden;
}

.inf-head {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translate(-25%, -10%);

  z-index: 2;
}

.inf-bot {
  background-color: var(--white);
  margin: 0;
  position: absolute;
  top: 35%; /* Bắt đầu từ giữa màn hình */
  /* left: 0; */
  min-height: 65%; /* Chiếm ít nhất nửa màn hình */
  border-top-left-radius: 50px;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.3);
}

.fa-arrow-left:hover {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3) !important;
  color: var(--organge);
}

.btn {
  transition: all 0.2s ease;
  display: inline-block;
}

.btn:hover {
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn:active {
  transform: scale(0.98); /* Thu nhỏ còn 98% */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
