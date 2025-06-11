import { useState } from 'react';
import { createFileRoute, useRouter, useSearch, Link } from '@tanstack/react-router';
import { supabase } from '../lib/supabaseClient';
import { apiClient } from '../lib/apiClient';

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || '/dashboard',
  }),
  component: LoginPage,
});

interface ApiError extends Error {
  message: string;
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { redirect } = useSearch({ from: '/login' });

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
        } catch (userError) {
          const apiError = userError as ApiError;
          if (apiError.message.includes('User not found in database')) {
            // Create user in database if not exists
            try {
              await apiClient.createUser({
                supabaseId: data.user.id,
                email: data.user.email || email,
                name: data.user.user_metadata?.name || null,
                avatar: data.user.user_metadata?.avatar_url || null,
              });
            } catch (createError) {
              const createApiError = createError as ApiError;
              console.warn('Failed to create user on login:', createApiError.message);
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
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-[#11131a] text-center">
          Welcome Back!
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">Sign in to your account</p>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
          className="w-full"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full text-lg px-6 py-4 rounded-lg border-none bg-[#e9eef4] text-[#3b5b7c] font-normal focus:outline-none mb-4 shadow-sm placeholder:text-gray-400"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full text-lg px-6 py-4 rounded-lg border-none bg-[#e9eef4] text-[#3b5b7c] font-normal focus:outline-none mb-6 shadow-sm placeholder:text-gray-400"
          />

          <button
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full text-xl px-6 py-4 rounded-lg bg-[#0d7aff] text-white font-semibold border-none disabled:bg-gray-400 disabled:text-gray-600 transition-colors mb-4"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="w-full text-center">
          <p className="text-gray-600 mb-4">
            Don't have an account?{' '}
            <Link
              to="/signup"
              search={{ redirect }}
              className="text-[#0d7aff] hover:underline font-semibold"
            >
              Create one here
            </Link>
          </p>

          <Link to="/auth" search={{ redirect }} className="text-gray-500 hover:underline text-sm">
            ← Back to welcome
          </Link>
        </div>
      </div>
    </div>
  );
}
