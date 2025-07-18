<template>
  <div class="d-flex">
    <!-- Nút toggle -->
    <button
      class="btn btn-outline-secondary toggle-btn d-md-none m-3"
      @click="toggleMenu"
    >
      <i class="fas fa-bars"></i>
    </button>

    <!-- Sidebar -->
    <div
      class="d-flex flex-column flex-shrink-0 p-4 text-white navigation"
      :class="{ 'd-none': !menuVisible }"
      style="width: 250px; height: 100vh"
    >
      <h5 class="text-dark fw-bold mb-4 px-3">THE BOOKS</h5>

      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <router-link
            to="/"
            active-class="active"
            class="nav-link d-flex align-items-center text-dark"
          >
            <i class="fa-solid fa-house me-2 p-2"></i> Discover
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/category"
            active-class="active"
            class="nav-link d-flex align-items-center text-dark"
          >
            <i class="bx bxs-grid-circle me-2 p-2"></i> Category
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/borrowed"
            active-class="active"
            class="nav-link d-flex align-items-center text-dark"
          >
            <i class="fa-regular fa-handshake me-2 p-2"></i>Borrowed
          </router-link>
        </li>
        <li class="nav-item" v-if="role === 'admin'">
          <router-link
            to="/add-book"
            active-class="active"
            class="nav-link d-flex align-items-center text-dark"
          >
            <i class="bx bx-book-add me-2 p-2"></i> Add Book
          </router-link>
        </li>
        <li class="nav-item" v-if="role === 'admin'">
          <router-link
            to="/account"
            active-class="active"
            class="nav-link d-flex align-items-center text-dark"
          >
            <i class="bx bx-book-add me-2 p-2"></i> Account Management
          </router-link>
        </li>
      </ul>

      <hr />
      <div class="d-flex flex-column gap-2">
        <a href="#" class="custom-nav-link">
          <i class="bi bi-gear-fill"></i> Setting
        </a>
        <a href="#" class="custom-nav-link">
          <i class="bi bi-question-circle-fill"></i> Help
        </a>
        <a @click="_logout" class="custom-nav-link">
          <i class="bi bi-box-arrow-right"></i> Log out
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const prep = defineProps({ role: {} });

const menuVisible = ref(true); // trạng thái hiển thị menu

const toggleMenu = () => {
  menuVisible.value = !menuVisible.value;
};

const _logout = () => {
  localStorage.removeItem('token');
  location.reload();
};
</script>

<style scoped>
.nav-link:hover {
  background-color: #eaeaea;
  border-radius: 8px;
}
.nav-link.active {
  background-color: transparent; /* Màu nền xanh */
  font-weight: bold;
}
.nav-link.active i {
  background-color: var(--organge);
  border-radius: 10px;
  color: white;
}

i {
  font-size: 20px;
}
.navigation {
  background-color: var(--white);
}

.custom-nav-link {
  background-color: transparent;
  border: none;
  color: #343a40; /* text-dark */
  transition:
    background-color 0.3s,
    color 0.3s;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  text-decoration: none;
}

.custom-nav-link:hover {
  background-color: #e9ecef; /* Màu xám nhạt khi hover */
  color: #0d6efd; /* text-primary */
}

.custom-nav-link i {
  margin-right: 0.5rem;
  transition: color 0.3s;
}

.custom-nav-link:hover i {
  color: #0d6efd; /* icon cũng chuyển sang màu primary */
}
</style>
