<template>
  <div class="page">
    <div class="chat">
      <!-- Join -->
      <div v-if="!joined" class="join">
        <h2>💬 Simple Chat</h2>

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

        <button @click="joinChat">Join 🚀</button>

        <div v-if="error" class="error">{{ error }}</div>
      </div>

      <!-- Chat -->
      <div v-else class="chat-room">
        <div class="room-header">
          🔐 Global Chat
        </div>

        <div class="messages" ref="messagesBox">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="message"
            :class="{ system: msg.system }"
          >
            <template v-if="msg.system">
              {{ msg.text }}
            </template>

            <template v-else>
              <span class="avatar">{{ msg.avatar }}</span>
              <span class="bubble">
                <strong>{{ msg.username }}</strong><br />
                {{ msg.text }}
              </span>
            </template>
          </div>
        </div>

        <div class="input-bar">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="Type message..."
          />
          <button @click="sendMessage">➤</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import socket from '../socket';

export default {
  name: 'ChatView',
  data() {
    return {
      username: '',
      avatar: '😀',
      avatars: ['😀', '😎', '🤖', '🐱', '🐶', '🔥', '🎉'],
      password: '',
      error: '',
      joined: false,
      messages: [],
      newMessage: '',
    };
  },
  created() {
    socket.on('message', (message) => {
      this.messages.push(message);
      this.$nextTick(() => {
        this.scrollToBottom();
      });
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

      socket.emit('message', this.newMessage);
      this.newMessage = '';
    },
    scrollToBottom() {
      const box = this.$refs.messagesBox;
      if (box) box.scrollTop = box.scrollHeight;
    },
  },
};
</script>

<style>
/* 🌈 Background โง่ๆ */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffd6e0, #c8f7ff);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-family: system-ui, sans-serif;
}

/* 📱 Chat Container */
.chat {
  background: white;
  width: 100%;
  max-width: 420px;
  height: 90vh;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 🚪 Join */
.join {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.join h2 {
  text-align: center;
}

.join input,
.join select,
.join button {
  padding: 12px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid #ccc;
}

.join button {
  background: #ff7a9e;
  color: white;
  border: none;
}

/* 💬 Chat */
.chat-room {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.room-header {
  padding: 12px;
  background: #ff7a9e;
  color: white;
  text-align: center;
  font-weight: bold;
}

.messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: #fefefe;
}

/* 🧾 Message */
.message {
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.message.system {
  justify-content: center;
  font-size: 12px;
  color: #888;
}

/* 🫧 Bubble */
.avatar {
  font-size: 20px;
}

.bubble {
  background: #f1f1f1;
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 70%;
  word-wrap: break-word;
}

.bubble strong {
  font-size: 12px;
}

/* ⌨️ Input bar */
.input-bar {
  display: flex;
  padding: 8px;
  gap: 6px;
  border-top: 1px solid #eee;
}

.input-bar input {
  flex: 1;
  padding: 12px;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.input-bar button {
  padding: 0 16px;
  border-radius: 20px;
  border: none;
  background: #ff7a9e;
  color: white;
  font-size: 18px;
}

/* 📱 Mobile tweak */
@media (max-width: 480px) {
  .chat {
    height: 100vh;
    border-radius: 0;
  }
}

.error {
  color: red;
  font-size: 12px;
  text-align: center;
}
</style>
