import { useState, useRef, useEffect } from 'react';
import { useSocketChat } from '../store/socketStore';

export function Chat() {
  const { connected, messages, sendMessage, userId, sessionId } = useSocketChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-none shadow-none">
      {/* Session Info Header */}
      <div className="bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-2 text-sm text-gray-600">
        Session: <span className="font-mono text-blue-600">{sessionId || 'Loading...'}</span>
        <span className="ml-4">Messages: {messages.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-0 py-6 md:px-8 md:py-8 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center mt-8">
            <div className="text-lg mb-2">🤖 AI Assistant Ready</div>
            <div>Start a conversation to test the Humanloop integration!</div>
          </div>
        )}
        {messages.map((msg, i) => {
          const isSent = msg.senderId === userId;
          const isSystem = msg.senderId === 'SYSTEM_USER';
          const isAgent = msg.role === 'assistant' || msg.senderId === 'agent';

          return (
            <div
              key={msg.messageId || i}
              className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-2xl px-4 py-3 max-w-[75%] break-words text-base shadow-md
                  ${
                    isSystem
                      ? 'bg-gray-200 text-gray-600'
                      : isAgent
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                        : isSent
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] ${isAgent || isSent ? 'text-white/70' : 'text-gray-400'}`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isSystem
                        ? 'bg-gray-300 text-gray-600'
                        : isAgent
                          ? 'bg-white/20 text-white'
                          : isSent
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {isSystem ? 'system' : isAgent ? '🤖 agent' : '👤 you'}
                  </span>
                </div>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 left-0 w-full bg-white/90 backdrop-blur border-t border-gray-200 p-4 flex gap-2 z-10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={connected ? 'Ask the AI assistant anything...' : 'Connecting...'}
          disabled={!connected}
          className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-200 disabled:bg-gray-100 bg-white shadow-sm"
        />
        <button
          onClick={handleSend}
          disabled={!connected || !input.trim()}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold shadow-md disabled:bg-gray-300 disabled:text-gray-500 transition-all hover:from-purple-700 hover:to-purple-800"
        >
          Send
        </button>
      </div>

      <div
        className={`absolute right-4 bottom-4 text-xs ${connected ? 'text-green-600' : 'text-red-500'}`}
      >
        {connected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
    </div>
  );
}
