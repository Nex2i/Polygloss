import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from './index';
import { setConnected, addMessage, clearMessages } from './chatSlice';
import type { ChatMessage } from './chatSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const SOCKET_PATH = '/api/chat';

let socket: Socket | null = null;

export function useSocketChat() {
  const dispatch = useAppDispatch();
  const connected = useAppSelector((state) => state.chat.connected);
  const messages = useAppSelector((state) => state.chat.messages);
  const initialized = useRef(false);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    // Generate userId on connect
    userIdRef.current = (Math.floor(Math.random() * 1_000_000) + 1).toString();
    socket = io(API_BASE_URL, {
      path: SOCKET_PATH,
      transports: ['websocket'],
    });
    socket.on('connect', () => {
      dispatch(setConnected(true));
    });
    socket.on('disconnect', () => {
      dispatch(setConnected(false));
    });
    socket.on('chat message', (data: ChatMessage & Partial<{ senderId: string }>) => {
      // If no senderId, treat as SYSTEM_USER
      if (!data.senderId) {
        data.senderId = 'SYSTEM_USER';
      }
      console.log(data);
      dispatch(addMessage(data as ChatMessage));
    });
    return () => {
      socket?.disconnect();
      initialized.current = false;
      dispatch(setConnected(false));
      dispatch(clearMessages());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const sendMessage = (content: string) => {
    console.log('Sending', content);
    if (socket && connected && content.trim() && userIdRef.current) {
      const message = {
        content,
        timestamp: new Date().toISOString(),
        senderId: userIdRef.current,
      } as ChatMessage;
      socket.emit('chat message', message);
      dispatch(addMessage(message));
    }
  };

  return {
    connected,
    messages,
    sendMessage,
    userId: userIdRef.current,
  };
}
