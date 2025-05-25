import { createSlice } from '@reduxjs/toolkit';

export interface ChatMessage {
  content: string;
  timestamp: string;
  senderId: string;
}

interface ChatState {
  connected: boolean;
  messages: ChatMessage[];
}

const initialState: ChatState = {
  connected: false,
  messages: [],
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
  },
});

export const { setConnected, addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
