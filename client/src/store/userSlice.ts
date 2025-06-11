import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../lib/apiClient';

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
}

const initialState: UserState = {
  user: null,
  supabaseUser: null,
  loading: false,
  error: null,
};

// Async thunk to fetch current user
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.getCurrentUser();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.supabaseUser = null;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
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
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
      });
  },
});

export const { clearUser, setError, clearError } = userSlice.actions;
export default userSlice.reducer;
