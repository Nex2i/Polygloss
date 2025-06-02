import { createSlice } from '@reduxjs/toolkit';

export interface ChatMessage {
  content: string;
  timestamp: string;
  senderId: string;
  messageId?: string;
  role?: 'user' | 'assistant' | 'system';
  sessionId?: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

interface ChatState {
  connected: boolean;
  messages: ChatMessage[];
  sessionId: string | null;
  sessionCreated: boolean;
  currentSession: ChatSession | null;
}

const initialState: ChatState = {
  connected: false,
  messages: [],
  sessionId: null,
  sessionCreated: false,
  currentSession: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConnected(state: ChatState, action: { payload: boolean }) {
      state.connected = action.payload;
    },
    addMessage(state: ChatState, action: { payload: ChatMessage }) {
      state.messages.push(action.payload);
    },
    clearMessages(state: ChatState) {
      state.messages = [];
    },
    setSessionId(state: ChatState, action: { payload: string }) {
      state.sessionId = action.payload;
    },
    setSessionCreated(state: ChatState, action: { payload: boolean }) {
      state.sessionCreated = action.payload;
    },
    setCurrentSession(state: ChatState, action: { payload: ChatSession }) {
      state.currentSession = action.payload;
      state.sessionId = action.payload.id;
      state.sessionCreated = true;
    },
    loadMessagesFromHistory(state: ChatState, action: { payload: ChatMessage[] }) {
      state.messages = action.payload;
    },
    appendMessage(state: ChatState, action: { payload: ChatMessage }) {
      // Similar to addMessage but for agent responses
      state.messages.push(action.payload);
    },
  },
});

export const {
  setConnected,
  addMessage,
  clearMessages,
  setSessionId,
  setSessionCreated,
  setCurrentSession,
  loadMessagesFromHistory,
  appendMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
