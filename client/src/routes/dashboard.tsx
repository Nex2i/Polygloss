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
    <div>
      <h2>Dashboard Page</h2>
      <button onClick={handleClick} disabled={isLoading || isFetching}>
        Ping API
      </button>
      <div style={{ marginTop: 16 }}>
        {isLoading || isFetching ? 'Loading...' : null}
        {error ? <span style={{ color: 'red' }}>Error: {error.message}</span> : null}
        {data && data.message ? <span>Response: {data.message}</span> : null}
      </div>
      <div style={{ marginTop: 32 }}>
        <Chat />
      </div>
    </div>
  );
}
