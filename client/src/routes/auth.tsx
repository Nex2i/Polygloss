import { useState } from 'react';
import { createFileRoute, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/auth')({
  component: Login,
});

function Login() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleStartChatting = () => {
    // In a real app, you would handle authentication here
    // For now, we'll just navigate to the dashboard
    router.navigate({ to: '/dashboard' });
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col items-center justify-between px-2 py-8">
      <div className="w-full max-w-[700px] flex flex-col items-center mt-4">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-[#11131a] w-full text-left leading-tight">
          Hola! What's your name?
        </h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full text-2xl px-7 py-6 rounded-2xl border-none bg-[#e9eef4] text-[#3b5b7c] font-normal focus:outline-none mb-0 mt-0 shadow-sm placeholder:text-gray-400"
        />
      </div>
      <button
        className="w-full max-w-[700px] text-2xl sm:text-3xl px-0 py-5 rounded-xl bg-[#0d7aff] text-white font-bold border-none mb-4 mt-0 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
        disabled={!username.trim()}
        onClick={handleStartChatting}
      >
        Start chatting
      </button>
    </div>
  );
}
