import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-sm">
        <h1 className="text-xl font-semibold">Practice Spanish</h1>
        {/* Settings Icon Placeholder */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.696.426 1.724.051 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
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

        {/* New Chat Options */}
        <div className="space-y-6">
          {/* Beginner */}
          <div className="flex items-center bg-white rounded-lg shadow p-4">
            <div className="flex-1 pr-4">
              <p className="text-sm text-blue-600">Beginner</p>
              <h3 className="text-lg font-semibold mb-1">Practice basic greetings</h3>
              <p className="text-gray-600 text-sm mb-3">
                Learn how to introduce yourself and greet others in Spanish.
              </p>
              <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 text-sm font-medium">
                Start
              </button>
            </div>
            {/* Image Placeholder */}
            <div className="w-24 h-24 bg-gray-300 rounded-md flex-shrink-0"></div>
          </div>

          {/* Intermediate */}
          <div className="flex items-center bg-white rounded-lg shadow p-4">
            <div className="flex-1 pr-4">
              <p className="text-sm text-blue-600">Intermediate</p>
              <h3 className="text-lg font-semibold mb-1">Order food at a restaurant</h3>
              <p className="text-gray-600 text-sm mb-3">
                Practice ordering food and drinks in a Spanish-speaking restaurant.
              </p>
              <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 text-sm font-medium">
                Start
              </button>
            </div>
            {/* Image Placeholder */}
            <div className="w-24 h-24 bg-gray-300 rounded-md flex-shrink-0"></div>
          </div>

          {/* Advanced */}
          <div className="flex items-center bg-white rounded-lg shadow p-4">
            <div className="flex-1 pr-4">
              <p className="text-sm text-blue-600">Advanced</p>
              <h3 className="text-lg font-semibold mb-1">Discuss current events</h3>
              <p className="text-gray-600 text-sm mb-3">
                Engage in a conversation about current events and express your opinions.
              </p>
              <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 text-sm font-medium">
                Start
              </button>
            </div>
            {/* Image Placeholder */}
            <div className="w-24 h-24 bg-gray-300 rounded-md flex-shrink-0"></div>
          </div>
        </div>

        {/* Past Sessions */}
        <h2 className="text-2xl font-bold mt-8 mb-4">Past sessions</h2>
        <div className="bg-white rounded-lg shadow p-4">
          {/* Session 1 */}
          <div className="flex justify-between items-center py-2 border-b last:border-b-0">
            <div>
              <p className="text-gray-800 font-medium">Session 1</p>
              <p className="text-sm text-blue-600">Greetings</p>
            </div>
            <p className="text-sm text-gray-500">2 days ago</p>
          </div>
          {/* Session 2 */}
          <div className="flex justify-between items-center py-2 border-b last:border-b-0">
            <div>
              <p className="text-gray-800 font-medium">Session 2</p>
              <p className="text-sm text-blue-600">Ordering food</p>
            </div>
            <p className="text-sm text-gray-500">1 week ago</p>
          </div>
          {/* Add more sessions here */}
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="flex justify-around p-4 bg-white border-t border-gray-200">
        {/* Home Icon/Link Placeholder */}
        <div className="flex flex-col items-center text-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l7 7M19 10v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-xs">Home</span>
        </div>
        {/* Chat Icon/Link Placeholder */}
        <Link to="/trainingchat" className="flex flex-col items-center text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-.55.55a1 1 0 01-1.415 0L9 16z"
            />
          </svg>
          <span className="text-xs">Chat</span>
        </Link>
        {/* Voice Chat Link */}
        <Link to="/voice-chat" className="flex flex-col items-center text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
          <span className="text-xs">Voice</span>
        </Link>
        {/* Settings Icon/Link Placeholder */}
        <div className="flex flex-col items-center text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.696.426 1.724.051 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-xs">Settings</span>
        </div>
      </footer>
    </div>
  );
}
