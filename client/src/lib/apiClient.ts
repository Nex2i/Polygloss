import { supabase } from './supabaseClient';

interface RequestOptions extends RequestInit {
  // You can add custom options here if needed in the future
}

async function apiClient<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  // Add other default headers if necessary, e.g., Content-Type
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.append('Content-Type', 'application/json');
  }


  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Attempt to parse error from response body
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // Ignore if response is not JSON
    }
    throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
  }

  // Handle cases where response might be empty (e.g., 204 No Content)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }
  // For non-JSON responses, or empty responses, you might return null or response.text()
  // For simplicity, returning null if not JSON. Adjust as needed.
  return null as any; // Cast to any to satisfy Promise<T> if response isn't JSON
}

export default apiClient;

// Example Usage (not part of the file content, just for illustration):
/*
interface MyData {
  id: number;
  name: string;
}

// GET request
apiClient<MyData>('/api/data')
  .then(data => console.log(data))
  .catch(error => console.error(error));

// POST request
apiClient<MyData>('/api/data', {
  method: 'POST',
  body: JSON.stringify({ name: 'New Item' }),
})
  .then(data => console.log(data))
  .catch(error => console.error(error));
*/
