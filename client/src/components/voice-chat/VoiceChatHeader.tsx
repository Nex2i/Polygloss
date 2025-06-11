import React from 'react';
import { useRouter } from '@tanstack/react-router';

const VoiceChatHeader: React.FC = () => {
  const router = useRouter();

  return (
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
      <h2 className="flex-grow text-center text-xl font-semibold text-gray-800">
        Voice Chat with AI
      </h2>
    </div>
  );
};

export default VoiceChatHeader;
