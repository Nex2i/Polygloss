import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from './index';
import {
  setConnected,
  addMessage,
  clearMessages,
  setCurrentSession,
  loadMessagesFromHistory,
  appendMessage,
} from './chatSlice';
import type { ChatMessage, ChatSession } from './chatSlice';
import { SOCKET_EVENTS } from './socket-events';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const SOCKET_PATH = '/api/chat/training';
const TEST_SESSION_ID = 'test-session';

let socket: Socket | null = null;

interface UseSocketChatResult {
  connected: boolean;
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  sendTrainingMessage: (content: string) => void;
  userId: string | null;
  sessionId: string | null;
  sessionCreated: boolean;
}

export function useSocketChat(): UseSocketChatResult {
  const dispatch = useAppDispatch();
  const connected = useAppSelector((state) => state.chat.connected);
  const messages = useAppSelector((state) => state.chat.messages);
  const sessionId = useAppSelector((state) => state.chat.sessionId);
  const sessionCreated = useAppSelector((state) => state.chat.sessionCreated);
  const initialized = useRef(false);
  const userIdRef = useRef<string | null>(null);
  const sessionInitialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Generate userId on connect
    // userIdRef.current = (Math.floor(Math.random() * 1_000_000) + 1).toString();
    userIdRef.current = 'test-user';

    socket = io(API_BASE_URL, {
      path: SOCKET_PATH,
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      dispatch(setConnected(true));

      // Initialize session after connection
      if (!sessionInitialized.current) {
        sessionInitialized.current = true;
        initializeSession();
      }
    });

    socket.on('disconnect', () => {
      dispatch(setConnected(false));
      sessionInitialized.current = false;
    });

    // Original training message handlers (keeping backward compatibility)
    socket.on(
      SOCKET_EVENTS.SEND_TRAINING_MESSAGE_SUCCESS,
      (data: ChatMessage & Partial<{ senderId: string }>) => {
        if (!data.senderId) {
          data.senderId = 'SYSTEM_USER';
        }
        console.log('Training message success:', data);
        dispatch(appendMessage(data as ChatMessage));
      }
    );

    // Session creation handlers
    socket.on(SOCKET_EVENTS.CREATE_CHAT_SESSION_SUCCESS, (data: { session: ChatSession }) => {
      console.log('Session created:', data.session);
      dispatch(setCurrentSession(data.session));

      // After creating session, load any existing history
      loadSessionHistory();
    });

    socket.on(SOCKET_EVENTS.CREATE_CHAT_SESSION_FAILURE, (data: { error: string }) => {
      console.error('Failed to create session:', data.error);
      // If session creation fails, try to load history anyway (session might already exist)
      loadSessionHistory();
    });

    // Chat history handlers
    socket.on(
      SOCKET_EVENTS.GET_CHAT_HISTORY_SUCCESS,
      (data: { messages: ChatMessage[]; sessionId: string }) => {
        console.log('Loaded chat history:', data.messages);
        dispatch(loadMessagesFromHistory(data.messages));
      }
    );

    socket.on(SOCKET_EVENTS.GET_CHAT_HISTORY_FAILURE, (data: { error: string }) => {
      console.error('Failed to load chat history:', data.error);
      // Clear messages if we can't load history
      dispatch(clearMessages());
    });

    // Agent message handlers
    socket.on(SOCKET_EVENTS.SEND_CHAT_MESSAGE_SUCCESS, (data: ChatMessage) => {
      console.log('Agent response:', data);
      dispatch(appendMessage(data));
    });

    socket.on(SOCKET_EVENTS.SEND_CHAT_MESSAGE_FAILURE, (data: { error: string }) => {
      console.error('Failed to send chat message:', data.error);
      // Could show a toast notification or error message here
    });

    return () => {
      socket?.disconnect();
      initialized.current = false;
      sessionInitialized.current = false;
      dispatch(setConnected(false));
      dispatch(clearMessages());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const initializeSession = () => {
    if (!socket || !userIdRef.current) return;

    console.log('Initializing session with ID:', TEST_SESSION_ID);

    // Create or get the test session with specific ID
    socket.emit(SOCKET_EVENTS.CREATE_CHAT_SESSION, {
      userId: userIdRef.current,
      sessionId: TEST_SESSION_ID,
    });
  };

  const loadSessionHistory = () => {
    if (!socket) return;

    console.log('Loading history for session:', TEST_SESSION_ID);
    socket.emit(SOCKET_EVENTS.GET_CHAT_HISTORY, {
      sessionId: TEST_SESSION_ID,
    });
  };

  const sendMessage = (content: string) => {
    console.log('Sending message:', content);
    if (socket && connected && content.trim() && userIdRef.current) {
      // Add user message to local state immediately
      const userMessage: ChatMessage = {
        content,
        timestamp: new Date().toISOString(),
        senderId: userIdRef.current,
        role: 'user',
        sessionId: TEST_SESSION_ID,
      };
      dispatch(addMessage(userMessage));

      // Send to agent via new chat message event
      socket.emit(SOCKET_EVENTS.SEND_CHAT_MESSAGE, {
        content,
        sessionId: TEST_SESSION_ID,
        userId: userIdRef.current,
        promptPath: 'polygloss/chat-agent', // Optional: specify prompt path
      });
    }
  };

  const sendTrainingMessage = (content: string) => {
    console.log('Sending training message:', content);
    if (socket && connected && content.trim() && userIdRef.current) {
      // Send training message with sessionId and userId (backend will save both user and system messages)
      socket.emit(SOCKET_EVENTS.SEND_TRAINING_MESSAGE, {
        content,
        sessionId: TEST_SESSION_ID,
        userId: userIdRef.current,
        senderId: userIdRef.current,
      });
    }
  };

  return {
    connected,
    messages,
    sendMessage,
    sendTrainingMessage,
    userId: userIdRef.current,
    sessionId: TEST_SESSION_ID,
    sessionCreated,
  };
}
