<template>
  <main>
    <div class="d-flex justify-content-between my-4">
      <div v-for="(book, index) in book_list" :key="index">
        <router-link
          :to="`bookdetail/${book.masach}`"
          class="d-flex justify-content-between my-4 book"
        >
          <img
            :src="book.anhbia"
            alt=""
            style="
              height: 300px;
              border-radius: 5px;
              box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.3);
            "
          />
        </router-link>
      </div>
    </div>
  </main>
</template>
<script setup>
// import onMounted from 'vue';
// const prop = defineProps({
//     book_list:[  book: {
//     masach: String,
//     tensach: String,
//     dongia: Number,
//     soquyen: Number,
//     namxuatban: Number,
//     manxb: String,
//     tacgia: String,
//     anhbia: String,
//     mota: String,
//   },]
// });
const props = defineProps({
  book_list: {
    type: Array,
    required: true,
  },
});

// onMounted({
//     console.log(book_list);
// }
// )
</script>

<style scoped>
.book {
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.book:hover {
  transform: translateY(-5px);
  transform: scale(1.1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.thongtinsach {
  background-color: var(--sub-bg);
  border-top-left-radius: 2ch;
}
</style>
