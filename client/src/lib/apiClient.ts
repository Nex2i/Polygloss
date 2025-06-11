import { supabase } from './supabaseClient';

interface RequestOptions extends RequestInit {
  // You can add custom options here if needed in the future
}

interface CreateUserData {
  supabaseId: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface UserResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
  };
  supabaseUser?: {
    id: string;
    email: string;
    emailConfirmed: boolean;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL + '/api';
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      return {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      };
    }

    return {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const headers = await this.getAuthHeaders();

    console.log('baseUrl', this.baseUrl);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));

      // Create detailed error message with status code
      const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;

      // Log the error for debugging
      console.error(`API Error [${response.status}]:`, {
        endpoint,
        status: response.status,
        statusText: response.statusText,
        errorData,
        headers: Object.fromEntries(response.headers.entries()),
      });

      // Create error with additional context
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).statusText = response.statusText;
      (error as any).response = errorData;

      throw error;
    }

    return response.json();
  }

  // Public method for generic requests
  async makeRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, options);
  }

  // User-related methods
  async createUser(
    userData: CreateUserData
  ): Promise<{ message: string; user: UserResponse['user'] }> {
    return this.request('/auth/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request('/auth/me');
  }
}

export const apiClient = new ApiClient();

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
