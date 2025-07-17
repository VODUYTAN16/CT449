<template>
  <div
    class="modal fade"
    id="bookcontent"
    tabindex="-1"
    ref="myModal"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl" style="margin: auto">
      <div class="modal-content" style="background-color: transparent">
        <div class="body-book">
          <div class="wrapper">
            <div class="cover cover-left turn" style="z-index: 100">
              <div class="page-cover">
                <img :src="book.anhbia" alt="" />
              </div>
            </div>
            <div class="cover cover-right turn">
              <div class="page-cover">
                <img src="../assets/back_cover.png" alt="" />
              </div>
            </div>

            <div class="book markdown-content">
              <!-- profile page -->

              <div class="book-page page-right">
                <div class="page-front">
                  <img src="../assets/back_cover.png" alt="" />
                </div>
                <div class="page-back bg-light py-5" style="overflow: hidden">
                  <div class="container text-center">
                    <!-- Biểu tượng hoặc logo nhỏ -->

                    <!-- Tiêu đề sách -->
                    <h1 class="display-6 fw-bold mb-2">
                      📖 {{ book.tensach }}
                    </h1>
                    <h5 class="text-secondary mb-3">
                      Tác giả: {{ book.tacgia }}
                    </h5>

                    <!-- Trích dẫn mở đầu -->
                    <blockquote class="blockquote fst-italic text-muted mb-4">
                      “Cuộc đời của một người là quyển sách sinh động, đáng giá
                      nhất!...”
                    </blockquote>

                    <!-- Mô tả ngắn -->
                    <p class="lead mb-4">
                      {{ book.mota }}
                    </p>

                    <!-- Credit -->
                    <div class="text-muted small mb-4">
                      <p>
                        Nhà xuất bản:
                        <strong>{{ book.nxb_info?.tennxb }}</strong>
                      </p>
                      <p>
                        Địa chỉ:
                        <strong>{{ book.nxb_info?.diachi }}</strong>
                      </p>
                      <p>
                        Năm xuất bản: <strong>{{ book.namxuatban }}</strong>
                      </p>
                      <!-- <p>Thiết kế: <strong>Bạn</strong> 💻</p> -->
                    </div>
                  </div>
                  <!-- Nút bắt đầu -->
                  <div class="d-flex justify-content-end">
                    <a
                      href="#"
                      class="btn contact-me btn-danger px-4 py-2 fw-bold shadow-sm"
                      style="width: 2rem; height: 2rem"
                    >
                      <i class="bx bx-arrow-in-down-right-square"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div class="book-content">
                <div
                  v-for="pageIndex in 3"
                  :key="pageIndex"
                  class="book-page page-right"
                  :id="`turn-${pageIndex}`"
                >
                  <!-- Trang lẻ (1,3,5) -->
                  <div class="page-front">
                    <span class="number-page">{{ pageIndex * 2 - 1 }}</span>
                    <div v-html="renderedPages[pageIndex * 2 - 2]"></div>

                    <span
                      v-if="pageIndex <= 3"
                      class="nextprev-btn"
                      :data-page="`turn-${pageIndex}`"
                    >
                      <i class="bx bx-chevron-right"></i>
                    </span>
                  </div>

                  <!-- Trang chẵn (2,4,6) -->
                  <div class="page-back">
                    <span class="number-page">{{ pageIndex * 2 }}</span>
                    <div v-html="renderedPages[pageIndex * 2 - 1]"></div>

                    <span
                      class="nextprev-btn back"
                      :data-page="`turn-${pageIndex}`"
                    >
                      <i class="bx bx-chevron-left"></i>
                    </span>

                    <a v-if="pageIndex === 3" href="#" class="back-profile">
                      <i class="bx bx-arrow-in-up-left-stroke-square"></i>
                    </a>
                  </div>
                </div>
              </div>

              <!-- 
              <div class="book-page page-right" id="turn-1">
                <div class="page-front">
                  <span class="number-page">1</span>

                  <span class="nextprev-btn" data-page="turn-1">
                    <i class="bx bx-chevron-right"></i>
                  </span>
                </div>

                <div class="page-back">
                  <span class="number-page">2</span>

                  <span class="nextprev-btn back" data-page="turn-1">
                    <i class="bx bx-chevron-left"></i>
                  </span>
                </div>
              </div>

              <div class="book-page page-right" id="turn-2">
                <div class="page-front">
                  <span class="number-page">3</span>

                  <span class="nextprev-btn" data-page="turn-2">
                    <i class="bx bx-chevron-right"></i>
                  </span>
                </div>
                <div class="page-back">
                  <span class="number-page">4</span>

                  <span class="nextprev-btn back" data-page="turn-2">
                    <i class="bx bx-chevron-left"></i>
                  </span>
                </div>
              </div>

              <div class="book-page page-right" id="turn-3">
                <div class="page-front">
                  <span class="number-page">5</span>

                  <span class="nextprev-btn" data-page="turn-3">
                    <i class="bx bx-chevron-right"></i>
                  </span>
                </div>
                <div class="page-back">
                  <span class="number-page">6</span>

                  <span class="nextprev-btn back" data-page="turn-3">
                    <i class="bx bx-chevron-left"></i>
                  </span>

                  <a href="#" class="back-profile">
                    <p>Profile</p>
                    <i class="bx bxs-user"></i>
                  </a>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
  border: none;
  outline: none;
  font-family: 'Montserrat', sans-serif;
}

.body-book {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: transparent;
  color: var(--text-color);
  overflow: hidden;
}

.wrapper {
  position: relative;
  width: 66rem;
  height: 43rem;
  padding: 2rem;
  perspective: 250rem;
  /* animation: show-animate 2s forwards; */
}

@keyframes show-animate {
  0%,
  30% {
    opacity: 0;
    transform: rotate(-20deg);
  }
  100% {
    opacity: 1;
    transform: rotate(0deg);
  }
}

.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  overflow: hidden;
  background: var(--cover-color);
  box-shadow: var(--box-shadow);
  border-top-left-radius: 0.6rem;
  border-bottom-left-radius: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-origin: right;
}

.page-cover {
  transform: rotateY(180deg) translateZ(1px);
}

.page-cover img,
.page-front img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* không cắt, không biến dạng */
  object-position: center; /* căn giữa */
  border-radius: 5px;
  /* box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.3); */
}

/* .cover.cover-left {
  z-index: -1;
} */

.cover.cover-left {
  transition: transform 1s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.cover.cover-left.turn {
  transform: rotateY(180deg);
  z-index: -1;
}

.cover.cover-right {
  z-index: -1;
  transition: transform 1s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.cover.cover-right.turn {
  transform: rotateY(180deg);
}

.book {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  perspective: 250rem;
}

.book .book-page {
  position: absolute;
  width: 50%;
  height: 100%;
  background: var(--pages-color);
  box-shadow: 0 0 0.6rem rgba(0, 0, 0 0.1);
  display: flex;
  padding: 2rem;
}

.book-page.page-left {
  box-shadow: -0.6rem 0.6rem 0.6rem rgba(0, 0, 0, 0.1);
}

.profile-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background: seagreen; */
}

/* .profile-page img {
  max-width: 180px;
  border-radius: 50%;
  border: 0.25rem solid var(--main-color);
  margin-bottom: 0.8rem;
} */

.profile-page .btn-box {
  margin-top: 1.2rem;
}

.btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 9.5rem;
  height: 3rem;
  background: var(--main-color);
  border: var(--border);
  border-radius: 0.3rem;
  font-size: 1rem;
  color: var(--white-color);
  font-weight: 500;
  margin: 0 1rem;
  transition: 0.5s;
}

.btn:hover {
  background: transparent;
  color: var(--main-color);
}

.btn-box .btn:nth-child(2) {
  background: transparent;
  color: var(--main-color);
}

.btn-box .btn:nth-child(2):hover {
  background: var(--main-color);
  color: var(--white-color);
}

.book-page.page-right {
  position: absolute;
  right: 0;
  transform-style: preserve-3d;
  transform-origin: left;
  transition: transform 1s cubic-bezier(0.645, 0.045, 0.355, 1);
  box-shadow: 0.6rem 0.6rem 0.6rem rgba(0, 0, 0, 0.1);
}

.book-page.page-right.turn {
  transform: rotateY(-180deg);
}

.book-page .page-front,
.book-page .page-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--pages-color);
  /* background-image: url('../assets/border.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover; */
  padding: 1.5rem 2rem;

  overflow: auto;
  box-sizing: border-box;
}

.page-front > div,
.page-back > div {
  height: calc(100% - 30px);
  overflow: auto;
  font-size: 14px; /* Kích thước chữ mặc định */
  line-height: 1.2; /* Khoảng cách dòng */
}

.book-page .page-front {
  transform: rotateY(0deg) translateZ(1px);
}

.book-page .page-back {
  transform: rotateY(180deg) translateZ(1px);
}

.title {
  text-align: center;
  margin-bottom: 1rem;
}

.workeduc-box {
  /* background: red; */
  border-left: var(--border);
}

.workeduc-box .workeduc-content {
  position: relative;
  /* background: seagreen; */
  padding-left: 1.6rem;
  margin-bottom: 1.2rem;
}

.workeduc-box .workeduc-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: -0.65rem;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  background: var(--main-color);
}

.workeduc-content .year {
  color: var(--main-color);
}

.workeduc-content .year i {
  margin-right: 0.4rem;
}

.number-page {
  position: absolute;
  bottom: 1.2rem;
  left: 50%;
  transform: translateX(-50%);
}

.nextprev-btn {
  position: absolute;
  bottom: 0.9rem;
  right: 1.5rem;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  font-size: 2rem;
  color: var(--second-text-color);
  display: flex;
  justify-content: center;
  align-items: center;
}

.nextprev-btn:hover {
  color: var(--main-color);
}

.nextprev-btn.back {
  left: 1.5rem;
}

.services-box {
  display: flex;
  /* flex-wrap: wrap có thể xuống dòng khi không đủ không gian hiện tại không */
  flex-wrap: wrap;
  gap: 1.5rem;
}

.services-box .services-content {
  /* flex: <có thể mở rộng khong> <có thể thu nhỏ không> <kích thước cơ bản của các phần tử> */
  flex: 1 1 10rem;
  border: var(--border);
  border-radius: 0.5rem;
  padding: 0.8rem 0.5rem 1.1rem;
  text-align: center;
  transition: 0.3s ease;
}

.services-box .services-content:hover {
  box-shadow: var(--box-shadow);
}

.services-content i {
  font-size: 2.5rem;
  color: var(--main-color);
}

.services-content h3 {
  font-size: 1.1rem;
}

.services-content p {
  margin: 0.2rem 0 0.8rem;
}

.services-content .btn {
  width: 8rem;
  height: 2.5rem;
}

.skills-box {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.skills-box .skills-content {
  /* background: red; */
  flex: 1 1 20rem;
}

.skills-content h3 {
  font-size: 1.3rem;
  line-height: 1;
  margin-bottom: 0.6rem;
}

.skills-content .content {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.skills-content .content span {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 6rem;
  height: 5rem;
  border: var(--border);
  border-radius: 0.3rem;
  font-weight: 600;
  transition: 0.3s ease;
}

.skills-content .content span:hover {
  box-shadow: var(--box-shadow);
}

.skills-content .content span i {
  font-size: 3rem;
  color: var(--main-color);
}

.portfolio-box .img-box {
  display: flex;
  /* justify-content: center;
    align-items: center; */
  width: 100%;
  height: 15rem;
  border: var(--border);
  border-radius: 0.5rem;
  overflow: hidden;
}

.portfolio-box .img-box img {
  width: 100%;
  object-fit: cover;
  transition: 0.5s ease;
}

.portfolio-box .img-box:hover img {
  transform: scale(1.1);
}

.portfolio-box .info-box {
  margin: 1rem 0 1.5rem;
}

.portfolio-box .info-box .info-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.portfolio-box .info-box .info-title h3 {
  font-size: 1.3rem;
}

.portfolio-box .info-box .info-title a {
  display: flex;
  align-items: center;
  color: var(--main-color);
}

.portfolio-box .info-box .info-title a i {
  margin-left: 0.3rem;
}

.portfolio-box .info-box p:nth-of-type(1) {
  font-weight: 600;
}

.portfolio-box .btn-box {
  display: flex;
  justify-content: center;
}

.portfolio-box .btn-box .btn {
  margin: 0 1.15rem;
}

.contact-box {
  text-align: center;
}

.contact-box .field {
  width: 100%;
  background: transparent;
  border: var(--border);
  border-radius: 0.3rem;
  padding: 0.8rem;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.contact-box .field::placeholder {
  color: var(--text-color);
}

.contact-box textarea {
  resize: none;
  height: 15rem;
}

.contact-box .btn {
  cursor: pointer;
}

.back-profile {
  position: absolute;
  bottom: 1.2rem;
  right: 2rem;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: var(--border);
  border-radius: 0.3rem;
  font-size: 1.1rem;
  color: var(--main-color);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: 0.5s;
}

.back-profile:hover {
  background: var(--main-color);
  color: var(--white-color);
}

.back-profile p {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%) scale(0.5);
  font-size: 1rem;
  color: var(--main-color);
  opacity: 0;
  transition: 0.5s;
}

.back-profile:hover p {
  opacity: 1;
  transform: translateX(-50%) scale(1);
  top: -1.8rem;
}
</style>
<script setup>
import { onMounted, computed, ref } from 'vue';
import { marked } from 'marked';

const myModal = ref(null);
const props = defineProps({
  book: {
    type: Object,
    required: true,
    default: () => ({
      noidung: `# XIN CHÀO Ạ
      ## TÔI TÊN LÀ TÂN`,
    }),
  },
});

// Hàm tách nội dung thành các trang theo từ
const splitContentByWords = (content, pageCount) => {
  const pages = [];
  const words = content.split(/\s+/);
  const wordsPerPage = Math.ceil(words.length / pageCount);

  let currentPage = 0;
  let startIndex = 0;

  for (let i = 0; i < pageCount; i++) {
    const endIndex = Math.min(startIndex + wordsPerPage, words.length);
    const pageWords = words.slice(startIndex, endIndex);

    // Đảm bảo không cắt ngang từ
    if (endIndex < words.length) {
      // Kiểm tra xem từ cuối cùng có bị cắt ngang không
      const lastWord = words[endIndex];
      if (lastWord && !/\W$/.test(pageWords[pageWords.length - 1])) {
        // Nếu bị cắt ngang, điều chỉnh lại
        pageWords.push(lastWord);
        startIndex = endIndex + 1;
      } else {
        startIndex = endIndex;
      }
    } else {
      startIndex = endIndex;
    }

    pages.push(pageWords.join(' '));
  }

  return pages;
};

// Hàm render markdown cho các trang
const renderedPages = computed(() => {
  if (!props.book.noidung) return Array(6).fill('');

  // Tách nội dung bằng dấu pagebreak nếu có
  const pageBreaks = props.book.noidung.split('<!-- pagebreak -->');

  // Nếu có đủ 6 phần từ pagebreak
  if (pageBreaks.length >= 6) {
    return pageBreaks
      .slice(0, 6)
      .map((content) => marked.parse(content.trim()));
  }

  // Chia nội dung theo từ nếu không có pagebreak
  const pages = splitContentByWords(props.book.noidung, 6);

  return pages.map((content) => (content ? marked.parse(content.trim()) : ''));
});
onMounted(() => {
  // const myModal = document.getElementById('bookcontent');
  console.log(myModal);
  myModal.value.addEventListener('shown.bs.modal', () => {
    // Lúc này modal đã mở hoàn toàn -> gắn sự kiện an toàn

    console.log('Modal đã mở!');

    const pageTurnBtn = document.querySelectorAll('.nextprev-btn');

    pageTurnBtn.forEach((el, index) => {
      el.onclick = () => {
        const pageTurnId = el.getAttribute('data-page');
        const pageTurn = document.getElementById(pageTurnId);

        if (pageTurn.classList.contains('turn')) {
          pageTurn.classList.remove('turn');
          setTimeout(() => {
            pageTurn.style.zIndex = 20 - index;
          }, 500);
        } else {
          pageTurn.classList.add('turn');
          setTimeout(() => {
            pageTurn.style.zIndex = 20 + index;
          }, 500);
        }
      };
    });

    // Contact me button
    const pages = document.querySelectorAll('.book-page.page-right');
    const contactMeBtn = document.querySelector('.btn.contact-me');

    console.log(pages);

    pages.forEach((_, index) => {
      pages[index].style.zIndex = 10 - index;
    });
    contactMeBtn.onclick = () => {
      pages.forEach((page, index) => {
        setTimeout(
          () => {
            page.classList.add('turn');
            setTimeout(() => {
              page.style.zIndex = 20 + index;
            }, 500);
          },
          (index + 1) * 200 + 100
        );
      });
    };

    // back profile button
    let totalPages = pages.length;
    let pageNumber = 0;

    function reverseIndex() {
      pageNumber--;
      if (pageNumber < 0) {
        pageNumber = totalPages - 1;
      }
    }

    const backProfileBtn = document.querySelector('.back-profile');

    backProfileBtn.onclick = () => {
      let i = 0;
      for (let index = totalPages - 1; index > 0; index--) {
        setTimeout(
          () => {
            // reverseIndex();
            pages[index].classList.remove('turn');

            setTimeout(() => {
              // reverseIndex();
              pages[index].style.zIndex = 30 - index;
              console.log(pages[index], index, pages[index].style.zIndex);
            }, 500);
          },
          (i + 1) * 200 + 100
        );
        i++;
      }
      // pages.forEach((_, index) => {
      //   setTimeout(
      //     () => {
      //       reverseIndex();
      //       pages[pageNumber].classList.remove('turn');

      //       setTimeout(() => {
      //         reverseIndex();
      //         pages[pageNumber].style.zIndex = 10 + index;
      //         console.log(
      //           pages[pageNumber],
      //           pageNumber,
      //           pages[pageNumber].style.zIndex
      //         );
      //       }, 500);
      //     },
      //     (index + 1) * 200 + 100
      //   );
      // });
    };

    // opening animation
    const coverLeft = document.querySelector('.cover.cover-left');
    const pageLeft = document.querySelector('.book-page.page-left');

    setTimeout(() => {
      coverLeft.classList.remove('turn');
    }, 500);

    setTimeout(() => {
      coverLeft.style.zIndex = -1;
    }, 1000);

    // setTimeout(() => {
    //   pageLeft.style.zIndex = 20;
    // }, 2000);

    pages.forEach((_, index) => {
      if (index != 0) return;
      console.log(pages[index]);
      setTimeout(
        () => {
          // reverseIndex();
          pages[index].classList.add('turn');

          // setTimeout(() => {
          //   reverseIndex();
          //   pages[pageNumber].style.zIndex = 10 + index;
          // }, 500);
        },
        (index + 1) * 200 + 500
      );
    });
  });
});
</script>
