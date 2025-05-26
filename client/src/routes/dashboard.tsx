import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { usePingApi } from '../hooks/usePingApi';
import { Chat } from '../components/Chat';

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  const [enabled, setEnabled] = useState(false);
  const { data, error, isLoading, isFetching, refetch } = usePingApi(enabled);

  const handleClick = () => {
    setEnabled(true);
    refetch();
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <div className="shrink-0 p-4 bg-white/80 backdrop-blur border-b border-gray-200 z-10">
        <h2 className="text-2xl font-bold mb-2">Dashboard Page</h2>
        <button
          onClick={handleClick}
          disabled={isLoading || isFetching}
          className="px-4 py-2 rounded bg-blue-600 text-white font-medium disabled:bg-gray-300 disabled:text-gray-500 mr-2"
        >
          Ping API
        </button>
        {isLoading || isFetching ? <span className="ml-2 text-gray-500">Loading...</span> : null}
        {error ? <span className="ml-2 text-red-500">Error: {error.message}</span> : null}
        {data && data.message ? (
          <span className="ml-2 text-green-600">Response: {data.message}</span>
        ) : null}
      </div>
      <div className="flex-1 min-h-0">
        <Chat />
      </div>
    </div>
  );
}
