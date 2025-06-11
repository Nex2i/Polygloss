import { createFileRoute, useSearch, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/auth')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || '/dashboard',
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = useSearch({ from: '/auth' });

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-[#11131a] text-center">
          Welcome to Polygloss!
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Choose how you'd like to get started
        </p>

        <div className="w-full flex flex-col space-y-4">
          <Link
            to="/login"
            search={{ redirect }}
            className="w-full text-xl px-6 py-4 rounded-lg bg-[#0d7aff] text-white font-semibold text-center hover:bg-blue-600 transition-colors"
          >
            Sign In
          </Link>

          <Link
            to="/signup"
            search={{ redirect }}
            className="w-full text-xl px-6 py-4 rounded-lg bg-green-500 text-white font-semibold text-center hover:bg-green-600 transition-colors"
          >
            Create New Account
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6 text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
