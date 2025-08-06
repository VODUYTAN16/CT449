<template>
  <div class="category-explorer">
    <div class="box"></div>
    <div class="sidebar">
      <!-- Header với tìm kiếm -->
      <div class="d-flex flex-column align-items-start mb-4">
        <h1 class="mb-4">🏷️ Explore Book Genres</h1>
        <form class="search-box shadow input-group w-50" @submit.prevent>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Find by title"
          />
          <button class="btn btn-success px-3">
            <i class="bx bx-grid-search"></i>
          </button>
        </form>
      </div>

      <h3>List of Categories</h3>
      <!-- Lưới thể loại -->
      <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4 mt-2">
        <div
          v-for="category in filteredCategories.reverse()"
          :key="category.id"
          class="col"
        >
          <div
            class="card h-100 category-card"
            style="box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1)"
          >
            <div class="card-img-top-container">
              <img
                :src="category.anhdm || '/placeholder-book.jpg'"
                class="card-img-top"
                alt="Ảnh thể loại"
              />
              <div class="book-count-badge">{{ category.sosach }} books</div>
            </div>
            <div class="card-body">
              <h5 class="card-title">{{ category.tendm }}</h5>
              <p class="card-text text-muted small">
                {{ category.mota || 'Khám phá bộ sưu tập đa dạng' }}
              </p>
            </div>
            <div class="card-footer bg-transparent">
              <button
                class="btn btn-sm btn-success w-100"
                @click="viewCategory(category.madm)"
              >
                View details
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="filteredCategories.length == 0 || !filteredCategories"
          class="text-center text-muted my-4"
        >
          <i class="bi bi-book" style="font-size: 2rem"></i>
          <div class="text-center text-danger fw-bold py-3">
            🔍 Found Nothing!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { _fetch_Category } from '../service/service';

const router = useRouter();

// 🧠 State
const categories = ref([]);
// const featuredBooks = ref([
//   {
//     id: 1,
//     title: 'Dune',
//     author: 'Frank Herbert',
//     cover: '/dune.jpg',
//     category: 'Khoa Học Viễn Tưởng',
//   },
//   {
//     id: 2,
//     title: '1984',
//     author: 'George Orwell',
//     cover: '/1984.jpg',
//     category: 'Khoa Học Viễn Tưởng',
//   },
//   {
//     id: 3,
//     title: 'The Martian',
//     author: 'Andy Weir',
//     cover: '/martian.jpg',
//     category: 'Khoa Học Viễn Tưởng',
//   },
//   {
//     id: 4,
//     title: 'Foundation',
//     author: 'Isaac Asimov',
//     cover: '/foundation.jpg',
//     category: 'Khoa Học Viễn Tưởng',
//   },
// ]);

const searchQuery = ref('');
const popularTags = ref([
  'Phổ biến',
  'Mới nhất',
  'Nhiều sách nhất',
  'Được yêu thích',
]);
const currentFeaturedCategory = ref('Khoa Học Viễn Tưởng');

function normalize(str) {
  return str
    .normalize('NFD') // Tách dấu
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
    .toLowerCase();
}

// 🧩 Computed
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value;
  const query = normalize(searchQuery.value);

  return categories.value.filter((cat) =>
    normalize(cat.tendm || '').includes(query)
  );
});

// const chunkedFeaturedBooks = computed(() => {
//   const chunkSize = 4;
//   const chunks = [];
//   for (let i = 0; i < featuredBooks.value.length; i += chunkSize) {
//     chunks.push(featuredBooks.value.slice(i, i + chunkSize));
//   }
//   return chunks;
// });

// 🎯 Methods
const applyTagFilter = (tag) => {
  searchQuery.value = tag;
};

const viewCategory = async (category) => {
  try {
    // Chuyển route và truyền dữ liệu bằng history.state
    router.push({
      name: 'Discover',
      state: { category: category },
    });
  } catch (error) {
    console.error('Error loading books:', error);
  }
};

// 🎠 Carousel ID
const carousel = ref(null);
const carouselId =
  'categoryCarousel' + Math.random().toString(36).substring(2, 9);

// 🚀 Fetch API khi component mount
onMounted(async () => {
  try {
    categories.value = await _fetch_Category();
    console.log(categories.value);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thể loại:', error);
  }

  // Tạo carousel nếu dùng Bootstrap
  if (carousel.value) {
    carousel.value.id = carouselId;
    if (window.bootstrap) {
      new window.bootstrap.Carousel(carousel.value, {
        interval: 5000,
        wrap: true,
      });
    }
  }
});
</script>

<style scoped>
.category-explorer {
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

.category-card {
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #eee;
}
.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-img-top-container {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.card-img-top {
  object-fit: cover;
  height: 100%;
  width: 100%;
  transition: transform 0.5s;
}

.category-card:hover .card-img-top {
  transform: scale(1.05);
}

.book-count-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.search-box {
  max-width: 400px;
}

.filter-tags {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.carousel-control-prev,
.carousel-control-next {
  width: 5%;
  background: rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .d-flex {
    flex-direction: column;
  }

  .search-box {
    width: 100% !important;
    margin-top: 15px;
  }

  .row-cols-2 > * {
    flex: 0 0 auto;
    width: 100%;
  }
}
</style>
