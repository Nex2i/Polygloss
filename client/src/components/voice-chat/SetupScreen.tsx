import React from 'react';

interface SetupScreenProps {
  selectedLevel: number;
  onLevelChange: (level: number) => void;
  onConnect: () => void;
  isConnecting: boolean;
}

const SetupScreen: React.FC<SetupScreenProps> = ({
  selectedLevel,
  onLevelChange,
  onConnect,
  isConnecting,
}) => {
  // Generate lesson level options (1-5)
  const lessonLevels = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-none">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Start Voice Conversation
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        {/* Lesson Level Dropdown */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Lesson Level
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => onLevelChange(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {lessonLevels.map((level) => (
              <option key={level} value={level}>
                Level {level}{' '}
                {level <= 2 ? '(Beginner)' : level <= 4 ? '(Intermediate)' : '(Advanced)'}
              </option>
            ))}
          </select>
        </div>

        {/* Connect Button */}
        <div className="w-full">
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Start Conversation
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;
