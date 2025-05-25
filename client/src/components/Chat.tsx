import { useState } from 'react';
import { useSocketChat } from '../store/socketStore';

export function Chat() {
  const { connected, messages, sendMessage, userId } = useSocketChat();
  const [input, setInput] = useState('');
  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-2">Chat</h3>
      <div className="min-h-[120px] max-h-[200px] overflow-y-auto mb-2 bg-gray-50 p-2 rounded flex flex-col gap-1.5">
        {messages.length === 0 && <div className="text-gray-400">No messages yet.</div>}
        {messages.map((msg, i) => {
          const isSent = msg.senderId === userId;
          const isSystem = msg.senderId === 'SYSTEM_USER';
          return (
            <div key={i} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`rounded px-3 py-1 max-w-[75%] break-words text-sm shadow-sm
                  ${
                    isSystem
                      ? 'bg-gray-200 text-gray-600'
                      : isSent
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                  }
                `}
              >
                <span className="block text-[10px] text-gray-400 mb-0.5">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                  {isSystem ? ' (system)' : ''}
                </span>
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={connected ? 'Type a message...' : 'Connecting...'}
          disabled={!connected}
          className="flex-1 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
        />
        <button
          onClick={handleSend}
          disabled={!connected || !input.trim()}
          className="px-4 py-1 rounded bg-blue-600 text-white font-medium disabled:bg-gray-300 disabled:text-gray-500"
        >
          Send
        </button>
      </div>
      <div className={`mt-2 text-xs ${connected ? 'text-green-600' : 'text-red-500'}`}>
        {connected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
}
