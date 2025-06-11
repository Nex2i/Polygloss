import React from 'react';
import AnimatedSphere from './AnimatedSphere';
import AudioInputIndicator from './AudioInputIndicator';

interface ConversationScreenProps {
  selectedLevel: number;
  audioLevel: number;
  isSpeaking: boolean;
  isConnected: boolean;
  onDisconnect: () => void;
}

const ConversationScreen: React.FC<ConversationScreenProps> = ({
  selectedLevel,
  audioLevel,
  isSpeaking,
  isConnected,
  onDisconnect,
}) => {
  const isListening = isConnected && !isSpeaking;

  return (
    <div className="w-full max-w-none">
      <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
        Level {selectedLevel} Conversation
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Left Column - Audio Indicator */}
        <div className="flex flex-col items-center">
          <AudioInputIndicator
            isListening={isListening}
            isSpeaking={isSpeaking}
            audioLevel={audioLevel}
          />

          {/* Connection Status */}
          <div className={`text-sm mb-4 ${isConnected ? 'text-green-600' : 'text-red-500'}`}>
            {isConnected ? '🟢 Connected to Eleven Labs' : '🔴 Disconnected'}
          </div>
        </div>

        {/* Center Column - Animated Sphere */}
        <div className="flex flex-col items-center">
          <AnimatedSphere
            audioLevel={audioLevel}
            isSpeaking={isSpeaking}
            isConnected={isConnected}
          />

          {/* AI Status */}
          {isSpeaking && (
            <div className="text-sm mb-4 text-purple-600 font-medium text-center">
              🗣️ AI is speaking...
            </div>
          )}
        </div>

        {/* Right Column - Controls */}
        <div className="flex flex-col items-center">
          <button
            onClick={onDisconnect}
            className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-200 w-full max-w-xs"
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationScreen;
