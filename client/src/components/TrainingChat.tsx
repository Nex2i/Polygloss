import { useState, useRef, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useSocketChat } from '../store/socketStore';

const TrainingChat = () => {
  const router = useRouter();
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
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center p-4 bg-white shadow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={() => router.navigate({ to: '/dashboard' })}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <h1 className="flex-grow text-center text-xl font-semibold text-gray-800">Spanish Tutor</h1>
      </div>

      {/* Chat Area */}
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center mt-8">No messages yet.</div>
        )}
        {messages.map((msg, i) => {
          const isSent = msg.senderId === userId;
          const isSystem = msg.senderId === 'SYSTEM_USER';
          return (
            <div
              key={i}
              className={`flex ${isSent ? 'items-start justify-end mb-4' : 'items-start mb-4'}`}
            >
              {!isSent && (
                <img
                  className="w-8 h-8 rounded-full mr-3"
                  src="/path/to/sofia-avatar.jpg"
                  alt="Sofia Avatar"
                />
              )}
              <div
                className={`p-3 rounded-lg shadow max-w-[70%] break-words text-base
                  ${
                    isSystem
                      ? 'bg-gray-200 text-gray-600'
                      : isSent
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800'
                  }
                `}
              >
                <p
                  className={`text-sm mb-1 ${isSent ? 'text-blue-100 text-right' : 'text-gray-600'}`}
                >
                  {isSent ? 'User' : isSystem ? 'System' : 'Sofia'}
                </p>
                <span className="block text-[10px] text-gray-400 mb-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                  {isSystem ? ' (system)' : ''}
                </span>
                <p>{msg.content}</p>
              </div>
              {isSent && (
                <img
                  className="w-8 h-8 rounded-full ml-3"
                  src="/path/to/user-avatar.jpg"
                  alt="User Avatar"
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center p-4 bg-white shadow-inner">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={connected ? 'Type a message...' : 'Connecting...'}
          disabled={!connected}
          className="flex-grow p-3 mr-3 rounded-full bg-gray-200 focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!connected || !input.trim()}
          className="px-4 py-2 rounded-full bg-blue-500 text-white font-semibold shadow disabled:bg-gray-300 disabled:text-gray-500"
        >
          Send
        </button>
      </div>

      {/* End Session Button */}
      <div className="p-4 bg-gray-100">
        <button className="w-full p-3 bg-gray-300 text-gray-800 font-semibold rounded-full shadow">
          End Session
        </button>
      </div>
      <div
        className={`absolute right-4 bottom-4 text-xs ${connected ? 'text-green-600' : 'text-red-500'}`}
      >
        {connected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
};

export default TrainingChat;
