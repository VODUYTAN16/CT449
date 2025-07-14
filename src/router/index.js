import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Discover from '@/components/Discover.vue';
import Category from '@/components/Category.vue';
import Borrowed from '@/components/Borrowed.vue';
import BookDetail from '@/components/BookDetail.vue';
import AddBook from '@/components/AddBook.vue';
import BookPage from '@/components/BookPage.vue';
import RegisterOrLogin from '@/components/RegisterOrLogin.vue';
import Login from '@/components/LeafFall.vue';
import UserManagement from '@/components/UserManagement.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Discover',
      component: Discover,
    },
    {
      path: '/category',
      name: 'Category',
      component: Category,
    },
    {
      path: '/borrowed',
      component: Borrowed,
    },
    {
      path: '/add-book',
      component: AddBook,
    },
    {
      path: '/book-page',
      component: UserManagement,
    },
    {
      path: '/bookdetail/:masach', // Chúng ta sẽ truyền tham số fileId
      name: 'BookDetail',
      component: BookDetail,
    },
  ],
});

export default router;
