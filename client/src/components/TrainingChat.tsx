const TrainingChat = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center p-4 bg-white shadow">
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <h1 className="flex-grow text-center text-xl font-semibold text-gray-800">Spanish Tutor</h1>
      </div>

      {/* Chat Area */}
      <div className="flex-grow p-4 overflow-y-auto">
        {/* Sofia's first message */}
        <div className="flex items-start mb-4">
          <img
            className="w-8 h-8 rounded-full mr-3"
            src="/path/to/sofia-avatar.jpg"
            alt="Sofia Avatar"
          />{' '}
          {/* Replace with actual avatar path */}
          <div className="bg-white p-3 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">Sofia</p>
            <p className="text-gray-800">
              Hola! Ready to practice your Spanish? Let's start with a simple greeting. How would
              you say 'Hello, how are you?' in Spanish?
            </p>
          </div>
        </div>

        {/* User's message */}
        <div className="flex items-start justify-end mb-4">
          <div className="bg-blue-500 text-white p-3 rounded-lg shadow">
            <p className="text-sm text-blue-100 mb-1 text-right">User</p>
            <p>Hola, ¿cómo estás?</p>
          </div>
          <img
            className="w-8 h-8 rounded-full ml-3"
            src="/path/to/user-avatar.jpg"
            alt="User Avatar"
          />{' '}
          {/* Replace with actual avatar path */}
        </div>

        {/* Sofia's second message */}
        <div className="flex items-start mb-4">
          <img
            className="w-8 h-8 rounded-full mr-3"
            src="/path/to/sofia-avatar.jpg"
            alt="Sofia Avatar"
          />{' '}
          {/* Replace with actual avatar path */}
          <div className="bg-white p-3 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">Sofia</p>
            <p className="text-gray-800">
              Muy bien! You got it. Now, how about asking someone their name?
            </p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="flex items-center p-4 bg-white shadow-inner">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-grow p-3 mr-3 rounded-full bg-gray-200 focus:outline-none"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-500 cursor-pointer"
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

      {/* End Session Button */}
      <div className="p-4 bg-gray-100">
        <button className="w-full p-3 bg-gray-300 text-gray-800 font-semibold rounded-full shadow">
          End Session
        </button>
      </div>
    </div>
  );
};

export default TrainingChat;
