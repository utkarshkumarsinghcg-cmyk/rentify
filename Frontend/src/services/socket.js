import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://localhost:5001';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
  }
  return socket;
};

export const joinUserRoom = (userId) => {
  if (userId) getSocket().emit('join', String(userId));
};

export const disconnectSocket = () => {
  if (socket) { socket.disconnect(); socket = null; }
};

export default getSocket;
