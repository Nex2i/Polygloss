import { useState } from 'react';
import { useSocketChat } from '../store/socketStore';

export function ChatExample() {
  const { connected, messages, sendMessage, sendTrainingMessage, userId, sessionId } =
    useSocketChat();
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleSendTrainingMessage = () => {
    if (input.trim()) {
      sendTrainingMessage(input);
      setInput('');
    }
  };

  const sendExampleMessages = () => {
    // Example AI messages
    sendMessage('What is the capital of France?');
    setTimeout(() => sendMessage('Tell me a joke'), 1000);

    // Example training messages
    setTimeout(() => sendTrainingMessage('I want to practice Spanish verbs'), 2000);
    setTimeout(() => sendTrainingMessage("Let's work on pronunciation"), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Chat Integration Example</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>Status:</strong> {connected ? '🟢 Connected' : '🔴 Disconnected'}
          </p>
          <p>
            <strong>Session:</strong>{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">{sessionId}</code>
          </p>
          <p>
            <strong>User ID:</strong>{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">{userId}</code>
          </p>
          <p>
            <strong>Messages:</strong> {messages.length}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Quick Test Examples</h3>
        <button
          onClick={sendExampleMessages}
          disabled={!connected}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
        >
          Send Example Messages
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Message Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* AI Messages */}
          <div className="border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-700 mb-2">🤖 AI Agent Messages</h4>
            <p className="text-sm text-gray-600 mb-3">
              Goes to Humanloop AI for intelligent responses with conversation context.
            </p>
            <div className="space-y-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask the AI anything..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <button
                onClick={handleSendMessage}
                disabled={!connected || !input.trim()}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 transition-colors"
              >
                Send to AI Agent
              </button>
            </div>
          </div>

          {/* Training Messages */}
          <div className="border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-700 mb-2">📚 Training Messages</h4>
            <p className="text-sm text-gray-600 mb-3">
              Gets system acknowledgment responses. Useful for training scenarios.
            </p>
            <div className="space-y-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendTrainingMessage()}
                placeholder="Send training message..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
              />
              <button
                onClick={handleSendTrainingMessage}
                disabled={!connected || !input.trim()}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors"
              >
                Send Training Message
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Recent Messages</h3>
        <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">
              No messages yet. Try sending a message above!
            </p>
          ) : (
            <div className="space-y-2">
              {messages.slice(-5).map((msg, i) => (
                <div key={msg.messageId || i} className="text-sm">
                  <span
                    className={`font-medium ${
                      msg.role === 'user'
                        ? 'text-blue-600'
                        : msg.role === 'assistant'
                          ? 'text-purple-600'
                          : 'text-green-600'
                    }`}
                  >
                    {msg.role === 'user'
                      ? '👤 You'
                      : msg.role === 'assistant'
                        ? '🤖 Agent'
                        : '📚 System'}
                    :
                  </span>
                  <span className="ml-2 text-gray-700">{msg.content}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <h4 className="font-medium mb-2">How it works:</h4>
        <ul className="space-y-1 list-disc list-inside">
          <li>
            <strong>AI Messages:</strong> Sent to Humanloop for intelligent responses with full
            conversation context
          </li>
          <li>
            <strong>Training Messages:</strong> Get system acknowledgments, useful for
            practice/training scenarios
          </li>
          <li>
            <strong>All messages:</strong> Automatically saved to the session history for
            persistence
          </li>
          <li>
            <strong>Session persistence:</strong> Conversation history loads automatically on
            reconnection
          </li>
        </ul>
      </div>
    </div>
  );
}
