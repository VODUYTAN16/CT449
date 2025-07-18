<template>
  <div>
    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :minimize="handleMinimize"
      :icons="icons"
      :open="openChat"
      :showEmoji="true"
      :showEdition="true"
      :showDeletion="true"
      :deletionConfirmation="true"
      :showTypingIndicator="showTypingIndicator"
      :showLauncher="true"
      :showCloseButton="true"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :disableUserListToggle="true"
      :messageStyling="messageStyling"
      :messageMargin="messageMargin"
      :showMinimizeButton="true"
      @onType="handleOnType"
      @edit="editMessage"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const API_KEY = 'AIzaSyDgM8SODo__PmaaFqdRF6g3wc_1ciSPBbM'; // 👈 Thay bằng API Key thật

const participants = ref([
  {
    id: 'user1',
    name: 'Assistant',
    imageUrl:
      'https://i.pinimg.com/736x/37/00/76/370076c26e450a99cbe76d2e4f281883.jpg',
  },
]);

const titleImageUrl =
  'https://i.pinimg.com/736x/18/c2/96/18c29680423dc8ec13e290b7bd9917a5.jpg';

const messageList = ref([
  { type: 'text', author: `me`, data: { text: `Tân so handsome!` } },
  { type: 'text', author: `user1`, data: { text: `Yesssssssss` } },
]);

const newMessagesCount = ref(0);
const isChatOpen = ref(false);
const showTypingIndicator = ref('');
const alwaysScrollToBottom = ref(false);
const messageStyling = ref(true);
const messageMargin = ref({ system: '25px auto' });

const colors = {
  header: { bg: `#DEAA79`, text: '#ffffff' },
  launcher: { bg: '#f97a00' },
  messageList: { bg: '#ffffff' },
  sentMessage: { bg: '#FFE6A9', text: '#000000' },
  receivedMessage: { bg: '#eaeaea', text: '#222222' },
  userInput: { bg: '#f4f7f9', text: '#565867' },
  emojiPicker: { bg: 'white', text: '#b8c3ca' },
};

// Gửi tin nhắn và gọi Gemini API
const onMessageWasSent = async (message) => {
  messageList.value.push(message);

  // Hiện "typing..."
  showTypingIndicator.value = 'user1';

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message.data.text }],
            },
          ],
        }),
      }
    );

    const data = await res.json();
    console.log(data);
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Xin lỗi, tôi chưa rõ.';

    messageList.value.push({
      type: 'text',
      author: 'user1',
      data: { text: reply },
    });
  } catch (e) {
    console.error('Gemini API error:', e);
    messageList.value.push({
      type: 'text',
      author: 'user1',
      data: { text: 'Có lỗi xảy ra khi gọi API.' },
    });
  } finally {
    showTypingIndicator.value = '';
  }
};

const openChat = () => {
  isChatOpen.value = true;
  newMessagesCount.value = 0;
};

const closeChat = () => {
  isChatOpen.value = false;
};

const handleMinimize = () => {
  isChatOpen.value = false;
};

const handleOnType = () => {
  console.log('Đang gõ...');
};

const editMessage = (message) => {
  const msg = messageList.value.find((m) => m.id === message.id);
  if (msg) {
    msg.isEdited = true;
    msg.data.text = message.data.text;
  }
};
</script>
<style></style>
