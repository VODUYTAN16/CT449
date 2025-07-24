<template>
  <div class="page">
    <h4>Thêm liên hệ</h4>
    <ContactForm :contact="contact" @submit:contact="createContact" />
    <p>{{ message }}</p>
  </div>
</template>
<script>
import ContactForm from '@/components/ContactForm.vue';
import ContactService from '@/services/contact.service';
export default {
  components: {
    ContactForm,
  },

  data() {
    return {
      contact: {},
      message: '',
    };
  },
  methods: {
    async getContact(id) {
      try {
        this.contact = await ContactService.get(id);
      } catch (error) {
        console.log(error);

        console.log(error);
        // Chuyển sang trang NotFound đồng thời giữ cho URL không đổi
        this.$router.push({
          name: 'notfound',
          params: {
            pathMatch: this.$route.path.split('/').slice(1),
          },
          query: this.$route.query,
          hash: this.$route.hash,
        });
      }
    },
    async createContact(data) {
      try {
        await ContactService.create(data);
        alert('Tạo liên hệ mới thành công.');
        this.$router.push({ name: 'contactbook' });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
