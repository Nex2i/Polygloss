# Chat History Service with Humanloop Integration

This document describes how to set up and use the in-memory chat history service with Humanloop AI agent integration.

## Setup

### 1. Environment Variables

Add the following to your `.env` file:

```env
# Humanloop AI
HUMANLOOP_API_KEY=your_humanloop_api_key_here
```

To get your Humanloop API key:
1. Sign up at [humanloop.com](https://humanloop.com)
2. Go to your organization settings
3. Generate an API key
4. Add it to your `.env` file

### 2. Humanloop Prompt Configuration

The service uses a default prompt path `polygloss/chat-agent`. You'll need to create this prompt in Humanloop:

1. Log into your Humanloop dashboard
2. Create a new Prompt called `chat-agent` in the `polygloss` directory
3. Configure it with a model like `gpt-4` or `gpt-3.5-turbo`
4. Set up a basic chat template like:

```
You are a helpful AI assistant for Polygloss. Answer questions clearly and helpfully.
```

## Usage

### Socket Events

The chat service provides the following socket events:

#### Create Chat Session
```javascript
// Emit
socket.emit('create-chat-session', { userId: 'user123' });

// Listen for response
socket.on('create-chat-session-success', (data) => {
  console.log('Session created:', data.session);
});

socket.on('create-chat-session-failure', (data) => {
  console.error('Failed to create session:', data.error);
});
```

#### Send Chat Message
```javascript
// Emit
socket.emit('send-chat-message', {
  content: 'Hello, how can you help me?',
  sessionId: 'session-id-here',
  userId: 'user123',
  promptPath: 'polygloss/chat-agent' // optional
});

// Listen for response
socket.on('send-chat-message-success', (data) => {
  console.log('Agent response:', data.content);
  console.log('Message ID:', data.messageId);
  console.log('Timestamp:', data.timestamp);
});

socket.on('send-chat-message-failure', (data) => {
  console.error('Failed to send message:', data.error);
});
```

#### Get Chat History
```javascript
// Emit
socket.emit('get-chat-history', { sessionId: 'session-id-here' });

// Listen for response
socket.on('get-chat-history-success', (data) => {
  console.log('Chat history:', data.messages);
  data.messages.forEach(msg => {
    console.log(`${msg.role}: ${msg.content} (${msg.timestamp})`);
  });
});

socket.on('get-chat-history-failure', (data) => {
  console.error('Failed to get history:', data.error);
});
```

#### Clear Chat History
```javascript
// Emit
socket.emit('clear-chat-history', { sessionId: 'session-id-here' });

// Listen for response
socket.on('clear-chat-history-success', (data) => {
  console.log('History cleared for session:', data.sessionId);
});

socket.on('clear-chat-history-failure', (data) => {
  console.error('Failed to clear history:', data.error);
});
```

#### Get Chat Statistics
```javascript
// Emit
socket.emit('get-chat-stats', {});

// Listen for response
socket.on('get-chat-stats-success', (data) => {
  console.log('Total sessions:', data.totalSessions);
  console.log('Total messages:', data.totalMessages);
  console.log('Average messages per session:', data.averageMessagesPerSession);
  console.log('Active sessions (24h):', data.activeSessions);
});

socket.on('get-chat-stats-failure', (data) => {
  console.error('Failed to get stats:', data.error);
});
```

## Features

### In-Memory Chat History
- Creates and manages chat sessions in memory
- Stores conversation history for context
- Provides session management (create, get, delete)
- Tracks message metadata (timestamps, IDs, roles)

### Humanloop AI Integration
- Calls Humanloop AI agents with conversation context
- Automatically logs interactions for monitoring and evaluation
- Supports custom prompt paths for different agent behaviors
- Handles response parsing from multiple formats

### Monitoring & Analytics
- Tracks chat statistics (sessions, messages, activity)
- Logs all interactions to Humanloop for evaluation
- Provides error handling and debugging information

## Architecture

```
Client (Socket.io) → Chat Socket → Chat History Service → Humanloop API
                                      ↓
                               In-Memory Database
                               (Sessions & Messages)
```

### Data Structures

#### ChatSession
```typescript
interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
}
```

#### ChatMessage
```typescript
interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  role: 'user' | 'assistant' | 'system';
  sessionId?: string;
}
```

## Error Handling

The service provides comprehensive error handling:
- Invalid session IDs
- Missing required fields
- Humanloop API errors
- Network connectivity issues
- Malformed responses

All errors are logged and returned through socket events with descriptive messages.

## Best Practices

1. **Session Management**: Create a new session for each conversation
2. **User IDs**: Always provide user IDs for proper tracking
3. **Error Handling**: Listen for both success and failure events
4. **Monitoring**: Check chat statistics periodically
5. **Prompt Management**: Use descriptive prompt paths in Humanloop

## Troubleshooting

### Common Issues

1. **"Failed to get agent response"**
   - Check your Humanloop API key
   - Verify the prompt path exists in Humanloop
   - Check network connectivity

2. **"Session not found"**
   - Ensure you've created a session first
   - Session IDs are case-sensitive

3. **"Message content is required"**
   - Make sure message content is not empty
   - Trim whitespace from messages

### Debugging

Enable debug logging by setting `NODE_ENV=development` in your `.env` file. This will log:
- Humanloop API calls
- Session operations
- Error details
- Response parsing steps 