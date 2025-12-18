<template>
  <div class="chat">
    <!-- Join -->
    <div v-if="!joined" class="join">
      <input v-model="username" placeholder="Your name" />

      <select v-model="avatar">
        <option v-for="emo in avatars" :key="emo" :value="emo">
          {{ emo }}
        </option>
      </select>

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        @keyup.enter="joinChat"
      />

      <button @click="joinChat">Join</button>

      <div v-if="error" class="error">{{ error }}</div>
    </div>

    <!-- Chat -->
    <div v-else class="chat-room">
      <div class="room-header">
        🔐 Global Chat
      </div>

      <div class="messages">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message"
        >
          <span v-if="msg.system">
            {{ msg.text }}
          </span>

          <span v-else>
            <span class="avatar">{{ msg.avatar }}</span>
            <strong>{{ msg.username }}:</strong>
            {{ msg.text }}
          </span>
        </div>
      </div>

      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
      />
    </div>
  </div>
</template>

<script>
import socket from '../socket';

export default {
  name: 'ChatView',
  data() {
    return {
      // join
      username: '',
      avatar: '😀',
      avatars: ['😀', '😎', '🤖', '🐱', '🐶', '🔥', '🎉'],
      password: '',
      error: '',
      joined: false,

      // chat
      messages: [],
      newMessage: '',
    };
  },
  created() {
    socket.on('message', (message) => {
      this.messages.push(message);
    });

    socket.on('join-error', (msg) => {
      this.error = msg;
    });

    socket.on('join-success', () => {
      this.joined = true;
      this.error = '';
    });
  },
  methods: {
    joinChat() {
      if (!this.username.trim() || !this.password.trim()) return;

      socket.emit('join', {
        username: this.username,
        avatar: this.avatar,
        password: this.password,
      });
    },
    sendMessage() {
      if (!this.newMessage.trim()) return;

      socket.emit('message', this.newMessage); // ✅ ส่ง string

      this.newMessage = '';
    },
  },
};
</script>

<style>
.chat {
  display: flex;
  flex-direction: column;
  height: 60vh;
  max-width: 600px;
  margin: auto;
}

.join {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.chat-room {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.room-header {
  padding: 8px;
  background: #f5f5f5;
  font-size: 14px;
  text-align: center;
}

.messages {
  flex: 1;
  overflow-y: auto;
}

.message {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.avatar {
  margin-right: 6px;
}

input,
select {
  padding: 8px;
  border: 1px solid #ccc;
}

button {
  padding: 8px 12px;
}

.error {
  color: red;
  font-size: 12px;
}
</style>
