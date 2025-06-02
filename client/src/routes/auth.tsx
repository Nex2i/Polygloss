import { useState } from 'react';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { supabase } from '../lib/supabaseClient'; // Adjusted path

export const Route = createFileRoute('/auth')({
  component: AuthPage,
});

function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

      // Check if user is successfully created,
      // Supabase might send back a user object with null session if email confirmation is required.
      // For this basic setup, we'll assume direct login or handle email confirmation separately if needed.
      if (data.user) {
        // If email confirmation is not required by your Supabase settings,
        // data.session will likely be null after signUp.
        // You might need to signIn the user explicitly or rely on onAuthStateChange
        // For now, let's try to sign in immediately after successful sign up for simplicity
        // or inform the user to check their email if confirmation is enabled.

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
        } else {
          router.navigate({ to: '/dashboard' });
        }
      } else {
        // This case might occur if email confirmation is pending
        setError("Sign up successful. Please check your email to confirm your account if required, then try signing in.");
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred during sign up.');
    }
    setLoading(false);
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.navigate({ to: '/dashboard' });
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred during sign in.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-[#11131a] text-center">
          Welcome!
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full" role="alert">
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
