import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../lib/apiClient';
import { supabase } from '../lib/supabaseClient';

interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  user: User | null;
  supabaseUser: {
    id: string;
    email: string;
    emailConfirmed: boolean;
  } | null;
  loading: boolean;
  error: string | null;
  shouldLogout: boolean; // New flag to trigger logout
}

interface ApiError extends Error {
  status?: number;
  message: string;
}

const initialState: UserState = {
  user: null,
  supabaseUser: null,
  loading: false,
  error: null,
  shouldLogout: false,
};

// Helper function to check if error is authentication-related
const isAuthError = (error: unknown): boolean => {
  const apiError = error as ApiError;

  // Check for authentication-related HTTP status codes
  const authStatusCodes = [401, 403];
  if (apiError?.status && authStatusCodes.includes(apiError.status)) {
    return true;
  }

  const authErrorMessages = [
    'Invalid Token',
    'Auth session missing',
    'Unauthorized',
    'Forbidden',
    'Invalid token',
    'Token expired',
    'Authentication failed',
  ];

  if (typeof error === 'string') {
    return authErrorMessages.some((msg) => error.includes(msg));
  }

  if (apiError?.message) {
    return authErrorMessages.some((msg) => apiError.message.includes(msg));
  }

  return false;
};

// Async thunk to fetch current user
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrent',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiClient.getCurrentUser();
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      // Check if this is an authentication error
      if (isAuthError(error)) {
        // Trigger logout for authentication errors
        dispatch(forceLogout());
        return rejectWithValue('Authentication failed - user logged out');
      }
      return rejectWithValue(apiError.message);
    }
  }
);

// Async thunk to create user
export const createUser = createAsyncThunk(
  'user/create',
  async (
    userData: {
      supabaseId: string;
      email: string;
      name?: string;
      avatar?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.createUser(userData);
      return { user: response.user, supabaseUser: null };
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message);
    }
  }
);

// Async thunk to handle logout
export const forceLogout = createAsyncThunk('user/forceLogout', async (_, { dispatch }) => {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
    // Clear user data
    dispatch(clearUser());
    return true;
  } catch (error) {
    console.error('Error during force logout:', error);
    // Even if logout fails, clear user data
    dispatch(clearUser());
    return true;
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.supabaseUser = null;
      state.error = null;
      state.shouldLogout = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setShouldLogout: (state, action) => {
      state.shouldLogout = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.supabaseUser = action.payload.supabaseUser || null;
        state.error = null;
        state.shouldLogout = false;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Don't set shouldLogout here as forceLogout handles it
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.supabaseUser = action.payload.supabaseUser;
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Force logout
      .addCase(forceLogout.fulfilled, (state) => {
        state.shouldLogout = true;
      });
  },
});

export const { clearUser, setError, clearError, setShouldLogout } = userSlice.actions;
export default userSlice.reducer;
