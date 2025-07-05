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

<script>
export default {
  name: 'app',
  data() {
    return {
      participants: [
        {
          id: 'user1',
          name: 'Customer',
          imageUrl:
            'https://i.pinimg.com/736x/37/00/76/370076c26e450a99cbe76d2e4f281883.jpg',
        },
      ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl:
        'https://i.pinimg.com/736x/18/c2/96/18c29680423dc8ec13e290b7bd9917a5.jpg',
      messageList: [
        { type: 'text', author: `me`, data: { text: `Tân so handsome!` } },
        { type: 'text', author: `user1`, data: { text: `Yesssssssss` } },
      ], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: false, // to determine whether the chat window should be open or closed
      showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: `#DEAA79`,
          text: '#ffffff',
        },
        launcher: {
          bg: '#f97a00',
        },
        messageList: {
          bg: '#ffffff',
        },
        sentMessage: {
          bg: '#FFE6A9',
          text: '#000000',
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222',
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867',
        },
        emojiPicker: {
          bg: 'white',
          text: '#b8c3ca',
        },
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true, // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
      messageMargin: { system: '25px auto' }, // sets the margin for the system messages
      acceptedFileTypes: ['image/*', 'audio/*'], // sets the accepted file types for the file input, in this example it accepts only images and audio files (omit to accept any type of file)
    };
  },
  methods: {
    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen
          ? this.newMessagesCount
          : this.newMessagesCount + 1;
        this.onMessageWasSent({
          author: 'support',
          type: 'text',
          data: { text },
        });
      }
    },
    onMessageWasSent(message) {
      // called when the user sends a message
      this.messageList = [...this.messageList, message];
    },
    openChat() {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true;
      this.newMessagesCount = 0;
    },
    closeChat() {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false;
    },
    handleScrollToTop() {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType() {
      console.log('Emit typing event');
    },
    editMessage(message) {
      const m = this.messageList.find((m) => m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    },
  },
};
</script>

<style></style>
