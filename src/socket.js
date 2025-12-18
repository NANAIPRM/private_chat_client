import { io } from 'socket.io-client';

const socket = io(
  'https://private-chat-server-1.onrender.com',
  {
    transports: ['websocket'],
  }
);

export default socket;
