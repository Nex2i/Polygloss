import { useState } from 'react';
import { createFileRoute, useRouter, useSearch, Link } from '@tanstack/react-router';
import { supabase } from '../lib/supabaseClient';
import { apiClient } from '../lib/apiClient';

export const Route = createFileRoute('/signup')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || '/dashboard',
  }),
  component: SignUpPage,
});

interface ApiError extends Error {
  message: string;
}

function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { redirect } = useSearch({ from: '/signup' });

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Create user in Supabase with first name in metadata
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: firstName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // 2. Check if user is successfully created in Supabase
      if (data.user) {
        try {
          // 3. Create user in project database
          await apiClient.createUser({
            supabaseId: data.user.id,
            email: data.user.email || email,
            name: firstName.trim() || undefined,
            avatar: data.user.user_metadata?.avatar_url || undefined,
          });
        } catch (dbError) {
          const apiError = dbError as ApiError;
          console.warn('Database user creation failed:', apiError.message);
          // Continue anyway, user will be created on first login if needed
        }

        // 4. Handle post-signup flow
        if (data.session) {
          // User is automatically signed in (email confirmation disabled)
          router.navigate({ to: redirect });
        } else {
          // Email confirmation is required
          setError(
            'Account created successfully! Please check your email to confirm your account, then return to sign in.'
          );
        }
      } else {
        setError('Account creation failed. Please try again.');
      }
    } catch (e: unknown) {
      setError((e as Error).message || 'An unexpected error occurred during account creation.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-[#11131a] text-center">
          Create Your Account
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">Join Polygloss and start learning!</p>

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
            handleSignUp();
          }}
          className="w-full"
        >
          <input
            type="text"
            placeholder="First Name *"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full text-lg px-6 py-4 rounded-lg border-none bg-[#e9eef4] text-[#3b5b7c] font-normal focus:outline-none mb-4 shadow-sm placeholder:text-gray-400"
          />

          <input
            type="email"
            placeholder="Email Address *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full text-lg px-6 py-4 rounded-lg border-none bg-[#e9eef4] text-[#3b5b7c] font-normal focus:outline-none mb-4 shadow-sm placeholder:text-gray-400"
          />

          <input
            type="password"
            placeholder="Password *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full text-lg px-6 py-4 rounded-lg border-none bg-[#e9eef4] text-[#3b5b7c] font-normal focus:outline-none mb-6 shadow-sm placeholder:text-gray-400"
          />

          <button
            type="submit"
            disabled={
              loading ||
              !firstName.trim() ||
              !email.trim() ||
              !password.trim() ||
              password.length < 6
            }
            className="w-full text-xl px-6 py-4 rounded-lg bg-green-500 text-white font-semibold border-none disabled:bg-gray-400 disabled:text-gray-600 transition-colors mb-4"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="w-full text-center">
          <p className="text-gray-600 mb-4">
            Already have an account?{' '}
            <Link
              to="/login"
              search={{ redirect }}
              className="text-[#0d7aff] hover:underline font-semibold"
            >
              Sign in here
            </Link>
          </p>

          <Link to="/auth" search={{ redirect }} className="text-gray-500 hover:underline text-sm">
            ← Back to welcome
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
