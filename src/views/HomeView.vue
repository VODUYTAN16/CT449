<script setup>
import Navigation from '../components/Navigation.vue';
import ChatBot from '../components/ChatBot.vue';
import RegisterOrLogin from '../components/RegisterOrLogin.vue';
import { ref } from 'vue';
import api from '../axios';
import { onMounted } from 'vue';

const isAuthenticated = ref(false);
onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const res = await api.post('/api/auth/verify-token');
      console.log(res);
      isAuthenticated.value = true;
    }
  } catch (error) {
    console.log(error);
    console.warn('Token hết hạn hoặc không hợp lệ:', error.response?.status);
    isAuthenticated.value = false;
  }
});
</script>

<template>
  <main style="overflow-x: hidden">
    <div v-if="isAuthenticated">
      <div class="row" style="position: relative">
        <div class="col-2 p-0 m-0"><Navigation></Navigation></div>
        <div
          class="col p-0 m-0"
          style="overflow-y: scroll !important; max-height: 100vh"
        >
          <router-view></router-view>
        </div>
      </div>
      <ChatBot style="z-index: 200; position: relative"></ChatBot>
    </div>
    <div v-else>
      <RegisterOrLogin></RegisterOrLogin>
    </div>
  </main>
</template>

<style scoped>
.row {
  background-color: var(--white);
}
</style>
