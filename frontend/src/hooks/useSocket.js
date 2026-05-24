import { useState, useEffect } from 'react';
import { getSocket, joinNote, leaveNote, sendContentUpdate } from '../services/socket';

export const useSocket = (noteId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [remoteContent, setRemoteContent] = useState(null);

  useEffect(() => {
    if (!noteId) return;

    let socket;
    try {
      socket = getSocket();
    } catch {
      setIsConnected(false);
      return;
    }

    const handleConnect = () => {
      setIsConnected(true);
      joinNote(noteId);
    };

    const handleDisconnect = () => setIsConnected(false);

    const handleContentUpdate = (data) => {
      setRemoteContent(data.content);
      setCollaborators(prev => {
        const exists = prev.some(c => c.id === data.updatedBy?.id);
        if (!exists && data.updatedBy) {
          return [...prev, data.updatedBy];
        }
        return prev;
      });
    };

    // Join immediately if already connected
    if (socket.connected) {
      setIsConnected(true);
      joinNote(noteId);
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('contentUpdate', handleContentUpdate);

    return () => {
      leaveNote(noteId);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('contentUpdate', handleContentUpdate);
      setIsConnected(false);
      setCollaborators([]);
    };
  }, [noteId]);

  const updateContent = (content, cursorPosition) => {
    sendContentUpdate(noteId, content, cursorPosition);
  };

  return { isConnected, collaborators, remoteContent, updateContent };
};