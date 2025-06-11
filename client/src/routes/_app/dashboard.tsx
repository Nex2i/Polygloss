import { createFileRoute, Link } from '@tanstack/react-router';
import { AuthDebugger } from '../../components/AuthDebugger';

export const Route = createFileRoute('/_app/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        {/* Auth Debugger - Remove this in production */}
        <AuthDebugger />

        <h2 className="text-2xl font-bold mb-6">Start a new chat</h2>

        {/* Voice Chat AI Option */}
        <div className="mb-6">
          <Link
            to="/voice-chat"
            className="flex items-center bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg shadow-lg p-4 text-white hover:from-purple-600 hover:to-blue-700 transition-colors"
          >
            <div className="flex-1 pr-4">
              <p className="text-sm text-purple-100">New Feature</p>
              <h3 className="text-lg font-semibold mb-1">Voice Chat with AI</h3>
              <p className="text-purple-100 text-sm mb-3">
                Practice speaking Spanish with our AI tutor using voice conversation.
              </p>
              <span className="px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium">
                Try Now
              </span>
            </div>
            {/* Voice Icon */}
            <div className="w-24 h-24 bg-white/20 rounded-md flex-shrink-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
