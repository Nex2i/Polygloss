import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function pingApi() {
  const res = await fetch(`${API_BASE_URL}/api/ping`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}

export function usePingApi(enabled: boolean) {
  return useQuery({
    queryKey: ['ping'],
    queryFn: pingApi,
    enabled,
    retry: false,
  });
}
