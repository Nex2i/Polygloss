# Testing Chat Integration with Humanloop

## Quick Test Guide

### 1. Start the Server
```bash
cd server
npm run dev
```

### 2. Start the Client
```bash
cd client
npm run dev
```

### 3. Test the Integration

1. **Open the chat interface** in your browser
2. **Check the session header** - you should see `Session: test-session`
3. **Send a test message** like "Hello, how are you?"
4. **Wait for the AI response** - you should see a purple message bubble with the agent's response

### 4. Expected Behavior

✅ **Session Creation**: The frontend automatically creates/gets the "test-session" session on connection  
✅ **Message History**: Any previous messages in the test session are loaded automatically  
✅ **AI Responses**: Messages are sent to Humanloop and responses are displayed  
✅ **Message Persistence**: Messages are stored in memory and persist during the session  
✅ **Training Messages**: Training messages are also saved to the session with system acknowledgments  

### 5. Available Message Types

**Regular Chat Messages** (via `sendMessage`):
- Sent to Humanloop AI agent
- Full conversation context
- Purple agent responses

**Training Messages** (via `sendTrainingMessage`):
- System acknowledgment responses
- Both user and system messages saved to session
- Useful for training/practice scenarios

### 6. Debugging

If something isn't working, check the browser console and server logs for:

- **Session creation logs**: `"Initializing session with ID: test-session"`
- **Message sending logs**: `"Sending message: [your message]"`
- **Training message logs**: `"Saved user training message: [message data]"`
- **Agent response logs**: `"Agent response: [response data]"`
- **History loading logs**: `"Loaded chat history: [messages array]"`

### 7. Common Issues

1. **No agent response**: Check your `HUMANLOOP_KEY` environment variable
2. **"Session not found" errors**: The session should auto-create, check server logs
3. **Connection issues**: Verify the WebSocket connection in browser dev tools
4. **Duplicate messages**: Training messages are now handled entirely by the backend

### 8. Testing Flow

```
1. Frontend connects → WebSocket established
2. Session initialized → test-session created/retrieved  
3. History loaded → Previous messages displayed
4. Send message → User message added locally
5. Agent called → Message sent to Humanloop
6. Response received → Agent response displayed
7. All messages → Stored in session history
8. Training messages → Both user and system saved automatically
```

### 9. Verify Humanloop Integration

In your Humanloop dashboard, you should see:
- Logs of conversations under the `polygloss/chat-agent` prompt
- User inputs and agent responses
- Session and user metadata

### 10. Sample Test Messages

Try these to test different scenarios:
- `"Hello, what can you help me with?"`
- `"Can you explain what Polygloss is?"`
- `"What's the weather like?"` (to test general knowledge)
- `"Tell me a joke"` (to test creativity)

The agent should respond contextually based on your Humanloop prompt configuration.

### 11. Testing Both Message Types

**For AI Agent Responses:**
```javascript
// This goes to Humanloop AI
sendMessage("What is the capital of France?");
```

**For Training/System Responses:**
```javascript  
// This gets a system acknowledgment
sendTrainingMessage("I want to practice Spanish verbs");
```

Both message types are now saved to the session history for context and persistence. 