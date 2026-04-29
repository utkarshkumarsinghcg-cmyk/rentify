/**
 * Socket.io Client Singleton
 * Always import from this file — never create a second socket instance.
 *
 * Two connection modes (backward-compatible):
 *  1. Legacy: getSocket() auto-creates an unauthenticated socket (existing dashboards).
 *  2. Auth:   connectSocket(token) upgrades to a JWT-authenticated socket (new useSocket hook).
 */
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://localhost:5001';

let socket = null;

/**
 * Returns the socket instance, creating an unauthenticated one if needed.
 * Kept for backward-compat so existing dashboard components do not crash.
 */
export const getSocket = () => {
  if (!socket) {
    socket = io(BASE_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socket.on('connect', () =>
      console.log('[Socket] Connected (legacy):', socket.id)
    );
    socket.on('connect_error', (err) =>
      console.warn('[Socket] connect_error:', err.message)
    );
  }
  return socket;
};

/**
 * Creates / upgrades the socket with JWT auth.
 * If a connected socket already exists, returns it immediately (singleton).
 * Call this after login so the server's auth middleware can verify the user.
 * @param {string} token  JWT access token from Redux auth state
 */
export const connectSocket = (token) => {
  // If already connected with auth, reuse it
  if (socket?.connected) return socket;

  // Disconnect any stale unauthenticated socket before creating an authed one
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(BASE_URL, {
    auth: { token },
    autoConnect: false,
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.connect();

  socket.on('connect', () =>
    console.log('[Socket] Authenticated connected:', socket.id)
  );
  socket.on('connect_error', (err) =>
    console.error('[Socket] Connection error:', err.message)
  );
  socket.on('disconnect', (reason) =>
    console.warn('[Socket] Disconnected:', reason)
  );

  return socket;
};

/**
 * Legacy helper — joins user and role rooms.
 * Kept for backward-compat with NotificationListener.jsx.
 * @param {string} userId
 * @param {string} role
 */
export const joinUserRoom = (userId, role) => {
  const s = getSocket();
  if (userId && s?.connected) s.emit('join', { userId, role });
};

/** Disconnects and clears the singleton. */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('[Socket] Manually disconnected');
  }
};

export default getSocket;
