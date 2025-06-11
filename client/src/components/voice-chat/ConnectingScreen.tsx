import React from 'react';

interface ConnectingScreenProps {
  selectedLevel: number;
}

const ConnectingScreen: React.FC<ConnectingScreenProps> = ({ selectedLevel }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">Calling teacher...</h2>
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600 text-center">
        Setting up your Level {selectedLevel} conversation
      </p>
    </div>
  );
};

export default ConnectingScreen;
