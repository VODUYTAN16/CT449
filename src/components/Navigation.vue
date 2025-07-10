<template>
  <div
    class="d-flex flex-column flex-shrink-0 p-4 text-white navigation"
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
          <i class="bx bxs-grid-circle me-2 p-2"></i> Category</router-link
        >
      </li>
      <li class="nav-item">
        <router-link
          to="/borrowed"
          active-class="active"
          class="nav-link d-flex align-items-center text-dark"
        >
          <i class="fa-regular fa-handshake me-2 p-2"></i>Borrowed</router-link
        >
      </li>
      <li class="nav-item">
        <router-link
          to="/add-book"
          active-class="active"
          class="nav-link d-flex align-items-center text-dark"
        >
          <i class="bx bx-book-add me-2 p-2"></i>
          Add Book</router-link
        >
      </li>
      <li class="nav-item">
        <router-link
          to="/book-page"
          active-class="active"
          class="nav-link d-flex align-items-center text-dark"
        >
          <i class="bx bx-book-add me-2 p-2"></i>
          BOOK</router-link
        >
      </li>
    </ul>

    <hr />
    <div class="d-flex flex-column gap-2">
      <a href="#" class="nav-link text-dark d-flex align-items-center">
        <i class="bi bi-gear-fill me-2"></i> Setting
      </a>
      <a href="#" class="nav-link text-dark d-flex align-items-center">
        <i class="bi bi-question-circle-fill me-2"></i> Help
      </a>
      <a href="#" class="nav-link text-dark d-flex align-items-center">
        <i class="bi bi-box-arrow-right me-2"></i> Log out
      </a>
    </div>
  </div>
</template>

<script setup></script>

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
</style>
