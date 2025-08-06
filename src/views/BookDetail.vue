<template>
  <main class="bookdetail">
    <div style="z-index: 1; position: relative">
      <LeafFall></LeafFall>
    </div>
    <router-link
      to="/"
      class="back-btn fs-2"
      style="z-index: 5; position: relative"
    >
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
          <h6>Remaining Quantity: {{ book.soquyen }}</h6>
        </div>
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
          class="btn bg-success text-white mt-3 mx-3"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#bookcontent"
          style="z-index: 10; position: relative; max-width: fit-content"
        >
          <i class="bx bx-reading"></i> Read Book
        </button>
      </div>
    </div>

    <div class="row gx-5 inf-bot px-5">
      <div class="col-12 d-flex flex-column align-items-center ms-5"></div>
      <!-- Description -->
      <div class="col-6 mb-4 px-5">
        <h5 class="fw-bold mb-3">Description</h5>
        <p class="text-muted" style="text-align: justify">{{ book.mota }}</p>
      </div>
      <!-- Additional Info -->
      <div class="col-6 px-5" style="border-left: 1px solid rgba(0, 0, 0, 0.3)">
        <div class="row justify-content-bet">
          <div class="col-md-5 mb-4">
            <h5 class="fw-bold mb-2">Language</h5>
            <p class="text-muted mb-4">Standard Vietnamese</p>

            <h5 class="fw-bold mb-2">Price</h5>
            <p class="text-muted">{{ book.dongia }} VND</p>
          </div>

          <div class="col mb-4">
            <h5 class="fw-bold mb-2">Publication Info</h5>
            <p>
              <span class="text-muted">Publisher:</span>
              {{ book.nxb_info?.tennxb }}
            </p>
            <p>
              <span class="text-muted">Address:</span>
              {{ book.nxb_info?.diachi }}
            </p>
            <p>
              <span class="text-muted">Publication Year:</span>
              {{ book.namxuatban }}
            </p>
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
              BOOK LOAN FORM
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm(madocgia, book.masach)">
              <div class="mb-3 row">
                <label
                  class="col-sm-4 col-form-label"
                  style="max-width: fit-content"
                  >Full Of Name:</label
                >
                <div class="col d-flex align-items-center">Võ duy tân</div>
              </div>

              <div class="mb-3 row">
                <label
                  class="col-sm-4 col-form-label"
                  style="max-width: fit-content"
                  >Phone Number:</label
                >

                <div class="col d-flex align-items-center">0008998998</div>
              </div>

              <div class="mb-3 row">
                <label
                  class="col-sm-4 col-form-label"
                  style="max-width: fit-content"
                  >Name Of Book:</label
                >
                <div class="col d-flex align-items-center">
                  {{ book.tensach }}
                </div>
              </div>

              <div class="mb-3 row">
                <label
                  class="col-sm-4 col-form-label"
                  style="max-width: fit-content"
                  >Quantity:</label
                >
                <div class="col d-flex align-items-center">1</div>
              </div>
              <div class="alert alert-info" role="alert">
                Kindly pick up the book in person at the library!
              </div>

              <hr />

              <div class="form-check mb-3">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="terms"
                  required
                />
                <label class="form-check-label" for="terms">
                  <em>
                    I agree with an overdue fee of 10.000 VND per day will be
                    applied for books returned past the due date. In the event
                    of a lost book, full compensation equal to 100% of the
                    book's value is required.
                  </em>
                </label>
              </div>

              <div class="text-end">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" class="btn btn-primary mx-2">
                  Confirm
                </button>
              </div>
            </form>
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
import BookPage from '../components/BookPage.vue';
import LeafFall from '../components/LeafFall.vue';
import {
  _fetch_Book_Detail,
  _borrow_book,
  _borrow_history,
  _fetch_current_account,
} from '../service/service';
import api from '../axios.js';

// // Data
// const modal = ref(null);
// let modalInstance = null;
const showModal = ref(false);
// const formData = ref({
//   madocgia: 'DG001',
//   masach: 'DG001',
//   manv: '',
//   ngaymuon: new Date().toISOString().split('T')[0], // Mặc định là ngày hiện tại
//   hantra: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//     .toISOString()
//     .split('T')[0],
//   trangthai: 3,
//   songaymuon: 7,
//   quahan: false,
// });
const currentUser = ref({});

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const submitForm = async (madocgia, masach) => {
  if (!confirm('Are you sure to borrow this book?')) return;

  try {
    console.log(book.value);

    if (!book.value) {
      alert('Book not found');
      return;
    } else if (book.value.soquyen <= 0) {
      alert('No copies available for borrowing');
      return;
    }

    const response = await _borrow_book(madocgia, masach);
    alert('Borrow book successfully!');
    closeModal();
    // resetForm();
  } catch (error) {
    console.error('Lỗi khi mượn sách:', error);
    alert(
      'Fail borrow book: ' + error.response?.data?.message || error.message
    );
  }
};

// const resetForm = () => {
//   formData.value = {
//     madocgia: 'DG001',
//     masach: 'DG001',
//     manv: '',
//     ngaymuon: new Date().toISOString().split('T')[0],
//     hantra: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//       .toISOString()
//       .split('T')[0],
//     trangthai: 3,
//     songaymuon: 7,
//     quahan: false,
//   };
// };

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

onMounted(async () => {
  const masach = route.params.masach;
  book.value = await _fetch_Book_Detail(masach);
  console.log(book.value);
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
  position: relative;
}

.inf-head {
  position: absolute;
  top: 15%;
  left: 35%;
  transform: translate(-25%, -10%);

  z-index: 3;
}

.inf-bot {
  z-index: 2;
  background-color: var(--white);
  margin: 0;
  position: absolute;
  top: 40%; /* Bắt đầu từ giữa màn hình */
  /* left: 0; */
  min-height: 65%; /* Chiếm ít nhất nửa màn hình */
  min-width: 100%;
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
