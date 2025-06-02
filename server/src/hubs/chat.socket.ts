import { Socket } from 'socket.io';
import { SOCKET_EVENTS } from '../constants/socket-events';
import { chatHistoryService, ChatSession, ChatMessage } from '../libs/chat-history.service';

export interface ChatMessagePayload {
  content: string;
  senderId?: string;
  sessionId: string;
  userId?: string;
}

export interface CreateSessionPayload {
  userId?: string;
  sessionId?: string;
}

export interface ChatHistoryPayload {
  sessionId: string;
}

export interface ChatStatsPayload {
  // No payload needed for stats
}

export interface ChatMessageSuccessResponse {
  content: string;
  timestamp: string;
  senderId: string;
  messageId: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
}

export interface ChatSessionSuccessResponse {
  session: ChatSession;
}

export interface ChatHistorySuccessResponse {
  messages: ChatMessage[];
  sessionId: string;
}

export interface ChatStatsSuccessResponse {
  totalSessions: number;
  totalMessages: number;
  averageMessagesPerSession: number;
  activeSessions: number;
}

export interface ChatMessageFailureResponse {
  error: string;
}

export function ChatSocket(socket: Socket) {
  // Original training message handler (keeping existing functionality but now saving to session)
  socket.on(SOCKET_EVENTS.SEND_TRAINING_MESSAGE, (payload: ChatMessagePayload) => {
    try {
      const { content, senderId, sessionId = 'test-session', userId = 'anonymous' } = payload;

      // Validate required fields
      if (!content?.trim()) {
        throw new Error('Message content is required');
      }

      // Ensure session exists, create if it doesn't
      let session = chatHistoryService.getSession(sessionId);
      if (!session) {
        console.log(`Training session ${sessionId} not found, creating it...`);
        session = chatHistoryService.createOrGetSession(sessionId, userId);
      }

      // Save the user's training message to the session
      const userMessage = chatHistoryService.addMessage(
        sessionId,
        content,
        senderId || userId,
        'user'
      );
      console.log('Saved user training message:', userMessage);

      // Generate system response (keeping the original training behavior)
      const systemResponseContent = `Training message received: "${content}". This is a system acknowledgment.`;

      // Save the system response to the session
      const systemMessage = chatHistoryService.addMessage(
        sessionId,
        systemResponseContent,
        'SYSTEM_USER',
        'system'
      );
      console.log('Saved system training response:', systemMessage);

      // Send the system response back to the client
      const responseMessage: ChatMessageSuccessResponse = {
        content: systemResponseContent,
        timestamp: systemMessage.timestamp,
        senderId: 'SYSTEM_USER',
        messageId: systemMessage.id,
        sessionId: sessionId,
        role: 'system',
      };

      socket.emit(SOCKET_EVENTS.SEND_TRAINING_MESSAGE_SUCCESS, responseMessage);
    } catch (err) {
      console.error('Error in training message handler:', err);
      socket.emit(SOCKET_EVENTS.SEND_TRAINING_MESSAGE_FAILURE, {
        error: err instanceof Error ? err.message : 'Unknown error',
      } as ChatMessageFailureResponse);
    }
  });

  // Create new chat session
  socket.on(SOCKET_EVENTS.CREATE_CHAT_SESSION, (payload: CreateSessionPayload) => {
    try {
      let session: ChatSession;

      if (payload.sessionId) {
        // Create or get session with specific ID
        session = chatHistoryService.createOrGetSession(payload.sessionId, payload.userId);
      } else {
        // Create session with random ID
        session = chatHistoryService.createSession(payload.userId);
      }

      socket.emit(SOCKET_EVENTS.CREATE_CHAT_SESSION_SUCCESS, {
        session,
      } as ChatSessionSuccessResponse);
    } catch (err) {
      socket.emit(SOCKET_EVENTS.CREATE_CHAT_SESSION_FAILURE, {
        error: err instanceof Error ? err.message : 'Failed to create chat session',
      } as ChatMessageFailureResponse);
    }
  });

  // Send chat message and get agent response
  socket.on(SOCKET_EVENTS.SEND_CHAT_MESSAGE, async (payload: ChatMessagePayload) => {
    try {
      const { content, sessionId, userId = 'anonymous' } = payload;

      // Validate required fields
      if (!content?.trim()) {
        throw new Error('Message content is required');
      }
      if (!sessionId) {
        throw new Error('Session ID is required');
      }

      // Check if session exists, if not create it
      let session = chatHistoryService.getSession(sessionId);
      if (!session) {
        console.log(`Session ${sessionId} not found, creating it...`);
        session = chatHistoryService.createOrGetSession(sessionId, userId);
      }

      // Call the agent and get response
      const agentResponse = await chatHistoryService.callAgent(sessionId, content, userId);

      const parsedOutput = JSON.parse(agentResponse.content);

      const providedLanguageOutput = parsedOutput['provided_language_output'];
      var englishOutput = parsedOutput['english_output'];

      const outputMessage = `${providedLanguageOutput} \n ${englishOutput}`;

      // Emit success response with the agent's message
      socket.emit(SOCKET_EVENTS.SEND_CHAT_MESSAGE_SUCCESS, {
        content: outputMessage,
        timestamp: agentResponse.metadata?.timestamp || new Date().toISOString(),
        senderId: 'agent',
        messageId: agentResponse.metadata?.messageId || 'agent_' + Date.now(),
        sessionId: sessionId,
        role: 'assistant',
      } as ChatMessageSuccessResponse);
    } catch (err) {
      socket.emit(SOCKET_EVENTS.SEND_CHAT_MESSAGE_FAILURE, {
        error: err instanceof Error ? err.message : 'Failed to process chat message',
      } as ChatMessageFailureResponse);
    }
  });

  // Get chat history for a session
  socket.on(SOCKET_EVENTS.GET_CHAT_HISTORY, (payload: ChatHistoryPayload) => {
    try {
      const { sessionId } = payload;

      if (!sessionId) {
        throw new Error('Session ID is required');
      }

      const messages = chatHistoryService.getHistory(sessionId);
      socket.emit(SOCKET_EVENTS.GET_CHAT_HISTORY_SUCCESS, {
        messages,
        sessionId,
      } as ChatHistorySuccessResponse);
    } catch (err) {
      socket.emit(SOCKET_EVENTS.GET_CHAT_HISTORY_FAILURE, {
        error: err instanceof Error ? err.message : 'Failed to retrieve chat history',
      } as ChatMessageFailureResponse);
    }
  });

  // Clear chat history for a session
  socket.on(SOCKET_EVENTS.CLEAR_CHAT_HISTORY, (payload: ChatHistoryPayload) => {
    try {
      const { sessionId } = payload;

      if (!sessionId) {
        throw new Error('Session ID is required');
      }

      const success = chatHistoryService.clearHistory(sessionId);
      if (!success) {
        throw new Error(`Session ${sessionId} not found`);
      }

      socket.emit(SOCKET_EVENTS.CLEAR_CHAT_HISTORY_SUCCESS, {
        sessionId,
        cleared: true,
      });
    } catch (err) {
      socket.emit(SOCKET_EVENTS.CLEAR_CHAT_HISTORY_FAILURE, {
        error: err instanceof Error ? err.message : 'Failed to clear chat history',
      } as ChatMessageFailureResponse);
    }
  });

  // Get chat statistics
  socket.on(SOCKET_EVENTS.GET_CHAT_STATS, (payload: ChatStatsPayload) => {
    try {
      const stats = chatHistoryService.getStats();
      socket.emit(SOCKET_EVENTS.GET_CHAT_STATS_SUCCESS, stats as ChatStatsSuccessResponse);
    } catch (err) {
      socket.emit(SOCKET_EVENTS.GET_CHAT_STATS_FAILURE, {
        error: err instanceof Error ? err.message : 'Failed to retrieve chat statistics',
      } as ChatMessageFailureResponse);
    }
  });
}
