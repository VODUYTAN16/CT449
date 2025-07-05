<template>
  <div class="discover">
    <div class="box"></div>
    <div class="sidebar">
      <h1 class="mb-4">📖 Discover</h1>
      <form
        class="d-flex align-items-center bg-white shadow px-4 py-2 my-2 search-bar"
      >
        <select
          v-model="selectedCategory"
          class="me-2 form-select"
          style="border: none"
        >
          <option
            v-for="(item, index) in categories"
            :key="index"
            style="border: none"
          >
            {{ item }}
          </option>
        </select>
        <div class="vr mx-3"></div>
        <i class="bx bx-search-big"></i>

        <input
          v-model="searchQuery"
          placeholder="Find the book you like..."
          class="me-2 flex-grow-1 form-control"
        />

        <button variant="dark" @click="onSearch" class="btn btn-success px-3">
          Search
        </button>
      </form>
      <div class="recommendation mt-5">
        <div class="d-flex justify-content-between">
          <h3>Book Recommendation</h3>
          <button
            class="btn btn-light d-flex justify-content-center align-items-center"
          >
            View all <i class="bx bx-chevron-right"></i>
          </button>
        </div>
        <!-- <div v-for="(book, index) in SachList" :key="index"> -->
        <BookList :book_list="SachList"></BookList>
        <!-- </div> -->
      </div>
      <!-- <div class="recommendation mt-5">
        <div class="d-flex justify-content-between">
          <h3>Book Category</h3>
          <button
            class="btn btn-light d-flex justify-content-center align-items-center border border-black"
          >
            <i class="bx bxs-slider-alt"></i>
          </button>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
// import BookDetail from './BookDetail.vue';
import BookList from './BookList.vue';
import { onMounted, ref } from 'vue';
import api from '../axios.js';
const selectedCategory = ref('All Categories');
const searchQuery = ref('');

const SachList = ref([]);
const categories = ref([
  'All Categories',
  'Money/Investing',
  'Design',
  'Business',
  'Self Improvement',
]);

const onSearch = () => {
  console.log(
    'Searching for:',
    searchQuery.value,
    'in',
    selectedCategory.value
  );
};

const _fetch_Book_List = async () => {
  const response = await api.get('/api/get_sach');
  return response.data;
};

onMounted(async () => {
  SachList.value = await _fetch_Book_List();
  console.log(SachList.value);
});
</script>
<style scoped>
.discover {
  position: relative;
}

.box {
  height: 50vh;
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
  top: 10%;
  left: 5%;
  width: 90%;
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
</style>
