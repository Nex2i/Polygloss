import { useAppSelector, useAppDispatch } from '../store';
import { fetchCurrentUser, clearUser } from '../store/userSlice';
import { useCallback } from 'react';

/**
 * Custom hook to access user data and related actions
 * This provides a cleaner interface for components to interact with user state
 */
export const useUser = () => {
  const dispatch = useAppDispatch();
  const { user, supabaseUser, loading, error } = useAppSelector((state) => state.user);

  // Memoized action creators
  const refreshUser = useCallback(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const logoutUser = useCallback(() => {
    dispatch(clearUser());
  }, [dispatch]);

  // Derived values for common use cases
  const isAuthenticated = !!user;
  const displayName = user?.name || user?.email || 'Anonymous User';
  const avatarUrl = user?.avatar;
  const emailVerified = supabaseUser?.emailConfirmed || false;

  return {
    // Core user data
    user,
    supabaseUser,

    // Loading and error states
    loading,
    error,

    // Derived/computed values
    isAuthenticated,
    displayName,
    avatarUrl,
    emailVerified,

    // Actions
    refreshUser,
    logoutUser,
  };
};
