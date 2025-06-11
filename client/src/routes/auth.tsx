import { useState } from 'react';
import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router';
import { supabase } from '../lib/supabaseClient'; // Adjusted path
import { apiClient } from '../lib/apiClient';

export const Route = createFileRoute('/auth')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || '/dashboard',
  }),
  component: AuthPage,
});

function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { redirect } = useSearch({ from: '/auth' });

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Check if user is successfully created
      if (data.user) {
        try {
          // Create user in database
          await apiClient.createUser({
            supabaseId: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || null,
            avatar: data.user.user_metadata?.avatar_url || null,
          });
        } catch (dbError: any) {
          console.warn('Database user creation failed:', dbError.message);
          // Continue anyway, user will be created on first login
        }

        // If a session exists, email confirmation is not required
        if (data.session) {
          // User is automatically signed in, navigate to redirect
          router.navigate({ to: redirect });
        } else {
          // No session means email confirmation is required
          setError(
            'Sign up successful! Please check your email to confirm your account, then return to sign in.'
          );
        }
      } else {
        setError('Sign up failed. Please try again.');
      }
    } catch (e: unknown) {
      setError((e as Error).message || 'An unexpected error occurred during sign up.');
    }
    setLoading(false);
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else if (data.user) {
        // Try to fetch user from database, create if doesn't exist
        try {
          await apiClient.getCurrentUser();
        } catch (userError: any) {
          if (userError.message.includes('User not found in database')) {
            // Create user in database if not exists
            try {
              await apiClient.createUser({
                supabaseId: data.user.id,
                email: data.user.email || email,
                name: data.user.user_metadata?.name || null,
                avatar: data.user.user_metadata?.avatar_url || null,
              });
            } catch (createError: any) {
              console.warn('Failed to create user on login:', createError.message);
            }
          }
        }
        router.navigate({ to: redirect });
      }
    } catch (e: unknown) {
      setError((e as Error).message || 'An unexpected error occurred during sign in.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-[#11131a] text-center">Welcome!</h1>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full text-lg px-6 py-4 rounded-lg border-none bg-[#e9eef4] text-[#3b5b7c] font-normal focus:outline-none mb-4 shadow-sm placeholder:text-gray-400"
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full text-lg px-6 py-4 rounded-lg border-none bg-[#e9eef4] text-[#3b5b7c] font-normal focus:outline-none mb-6 shadow-sm placeholder:text-gray-400"
        />
        <div className="w-full flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <button
            onClick={handleSignIn}
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full text-xl px-6 py-4 rounded-lg bg-[#0d7aff] text-white font-semibold border-none disabled:bg-gray-400 disabled:text-gray-600 transition-colors"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <button
            onClick={handleSignUp}
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full text-xl px-6 py-4 rounded-lg bg-green-500 text-white font-semibold border-none disabled:bg-gray-400 disabled:text-gray-600 transition-colors"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
