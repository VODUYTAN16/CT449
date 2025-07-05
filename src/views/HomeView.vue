<script setup>
import Navigation from '../components/Navigation.vue';
import ChatBot from '../components/ChatBot.vue';
</script>

<template>
  <main style="overflow-x: hidden">
    <div class="row">
      <div class="col-2 p-0 m-0"><Navigation></Navigation></div>
      <div class="col p-0 m-o"><router-view></router-view></div>
    </div>
    <ChatBot></ChatBot>
  </main>
</template>

<style scoped>
.row {
  background-color: var(--white);
}
</style>
