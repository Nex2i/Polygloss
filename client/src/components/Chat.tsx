import { useState, useRef, useEffect } from 'react';
import { useSocketChat } from '../store/socketStore';

export function Chat() {
  const { connected, messages, sendMessage, userId } = useSocketChat();
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
      <div className="flex-1 overflow-y-auto px-0 py-6 md:px-8 md:py-8 flex flex-col gap-2">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center mt-8">No messages yet.</div>
        )}
        {messages.map((msg, i) => {
          const isSent = msg.senderId === userId;
          const isSystem = msg.senderId === 'SYSTEM_USER';
          return (
            <div key={i} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`rounded-2xl px-4 py-2 max-w-[70%] break-words text-base shadow-md
                  ${
                    isSystem
                      ? 'bg-gray-200 text-gray-600'
                      : isSent
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                  }
                `}
              >
                <span className="block text-[10px] text-gray-400 mb-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                  {isSystem ? ' (system)' : ''}
                </span>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="sticky bottom-0 left-0 w-full bg-white/80 backdrop-blur border-t border-gray-200 p-4 flex gap-2 z-10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={connected ? 'Type a message...' : 'Connecting...'}
          disabled={!connected}
          className="flex-1 px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 bg-white shadow-sm"
        />
        <button
          onClick={handleSend}
          disabled={!connected || !input.trim()}
          className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-md disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
        >
          Send
        </button>
      </div>
      <div
        className={`absolute right-4 bottom-4 text-xs ${connected ? 'text-green-600' : 'text-red-500'}`}
      >
        {connected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
}
