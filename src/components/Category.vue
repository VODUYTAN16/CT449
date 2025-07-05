<template>
  <div class="category-explorer">
    <div class="box"></div>
    <div class="sidebar">
      <!-- Header với tìm kiếm -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">🏷️ Khám Phá Thể Loại</h1>
        <form class="search-box shadow input-group w-50">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Tìm thể loại..."
          />
          <button class="btn btn-success px-3">
            <i class="bx bx-grid-search"></i>
          </button>
        </form>
      </div>

      <!-- Bộ lọc nhanh -->
      <div class="filter-tags mb-4">
        <button
          v-for="tag in popularTags"
          :key="tag"
          class="btn btn-sm btn-outline-success me-2 mb-2"
          @click="applyTagFilter(tag)"
        >
          {{ tag }}
        </button>
      </div>

      <!-- Lưới thể loại -->
      <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4 mt-4">
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          class="col"
        >
          <div
            class="card h-100 category-card"
            style="box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1)"
          >
            <div class="card-img-top-container">
              <img
                :src="category.image || '/placeholder-book.jpg'"
                class="card-img-top"
                alt="Ảnh thể loại"
              />
              <div class="book-count-badge">{{ category.bookCount }} sách</div>
            </div>
            <div class="card-body">
              <h5 class="card-title">{{ category.name }}</h5>
              <p class="card-text text-muted small">
                {{ category.description || 'Khám phá bộ sưu tập đa dạng' }}
              </p>
            </div>
            <div class="card-footer bg-transparent">
              <button
                class="btn btn-sm btn-success w-100"
                @click="viewCategory(category)"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Tạo ID duy nhất cho carousel
const carouselId =
  'categoryCarousel' + Math.random().toString(36).substring(2, 9);
const carousel = ref(null);

// Dữ liệu mẫu
const categories = ref([
  {
    id: 1,
    name: 'Tâm lý học',
    description: 'Hiểu cách cơ thể phản ứng trước sự việc.',
    bookCount: 128,
    image:
      'https://i.pinimg.com/736x/c1/f3/43/c1f3431d7cb45d0c59d464ec02d5a4a2.jpg',
  },
  {
    id: 2,
    name: 'Kỹ năng bán hàng',
    description: 'Kỹ năng bán mọi loại hàng hóa.',
    bookCount: 92,
    image:
      'https://i.pinimg.com/736x/dc/25/92/dc25927a5bca85d31b0f5dfce357d3a2.jpg',
  },
  {
    id: 3,
    name: 'Kỹ Năng Sống',
    description: 'Phát triển bản thân và tư duy tích cực',
    bookCount: 76,
    image:
      'https://i.pinimg.com/736x/f5/59/21/f55921dfa179f60ada56c286d0254d00.jpg',
  },
  {
    id: 4,
    name: 'Kinh Tế - Tài Chính',
    description: 'Kiến thức quản lý tài chính cá nhân và đầu tư',
    bookCount: 64,
    image:
      'https://i.pinimg.com/736x/0a/f4/8d/0af48de23250dc1bba61e235fe544c6a.jpg',
  },
]);

const featuredBooks = ref([
  {
    id: 1,
    title: 'Dune',
    author: 'Frank Herbert',
    cover: '/dune.jpg',
    category: 'Khoa Học Viễn Tưởng',
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    cover: '/1984.jpg',
    category: 'Khoa Học Viễn Tưởng',
  },
  {
    id: 3,
    title: 'The Martian',
    author: 'Andy Weir',
    cover: '/martian.jpg',
    category: 'Khoa Học Viễn Tưởng',
  },
  {
    id: 4,
    title: 'Foundation',
    author: 'Isaac Asimov',
    cover: '/foundation.jpg',
    category: 'Khoa Học Viễn Tưởng',
  },
]);

// State
const searchQuery = ref('');
const popularTags = ref([
  'Phổ biến',
  'Mới nhất',
  'Nhiều sách nhất',
  'Được yêu thích',
]);
const currentFeaturedCategory = ref('Khoa Học Viễn Tưởng');

// Computed properties
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value;
  const query = searchQuery.value.toLowerCase();
  return categories.value.filter(
    (cat) =>
      cat.name.toLowerCase().includes(query) ||
      (cat.description && cat.description.toLowerCase().includes(query))
  );
});

const chunkedFeaturedBooks = computed(() => {
  const chunkSize = 4;
  const chunks = [];
  for (let i = 0; i < featuredBooks.value.length; i += chunkSize) {
    chunks.push(featuredBooks.value.slice(i, i + chunkSize));
  }
  return chunks;
});

// Methods
const applyTagFilter = (tag) => {
  searchQuery.value = tag;
};

const viewCategory = (category) => {
  currentFeaturedCategory.value = category.name;
  // Logic xử lý khi click vào thể loại
  console.log('Selected category:', category.name);

  // Cuộn đến carousel sau khi chọn thể loại
  setTimeout(() => {
    const element = document.querySelector('.featured-books-carousel');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
};

// Tự động khởi tạo carousel khi component được mount
onMounted(() => {
  // Tạo ID cho carousel element
  if (carousel.value) {
    carousel.value.id = carouselId;

    // Khởi tạo carousel nếu Bootstrap đã được load
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
