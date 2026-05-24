import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (token) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io('http://localhost:5000', {
    auth: { token }
  });

  socket.on('connect', () => {
    console.log('Connecté au serveur Socket.IO');
  });

  socket.on('error', (error) => {
    console.error('Erreur Socket.IO:', error);
  });

  socket.on('disconnect', () => {
    console.log('Déconnecté du serveur Socket.IO');
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket non initialisé. Appelez initSocket d\'abord.');
  }
  return socket;
};

export const joinNote = (noteId) => {
  if (!socket) return;
  socket.emit('joinNote', noteId);
};

export const leaveNote = (noteId) => {
  if (!socket) return;
  socket.emit('leaveNote', noteId);
};

export const sendContentUpdate = (noteId, content, cursorPosition) => {
  if (!socket) return;
  socket.emit('contentUpdate', { noteId, content, cursorPosition });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};