import React from 'react';

interface AudioInputIndicatorProps {
  isListening: boolean;
  isSpeaking: boolean;
  audioLevel: number;
}

const AudioInputIndicator: React.FC<AudioInputIndicatorProps> = ({
  isListening,
  isSpeaking,
  audioLevel,
}) => {
  const bars = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="flex items-center space-x-1 mb-4">
      <span className="text-sm text-gray-600 mr-2">
        {isSpeaking ? 'AI Speaking...' : isListening ? 'Listening...' : 'Not listening'}
      </span>
      <div className="flex items-end space-x-1">
        {bars.map((bar) => (
          <div
            key={bar}
            className={`w-2 bg-green-500 rounded-t transition-all duration-150 ${
              isListening ? 'animate-pulse' : ''
            }`}
            style={{
              height: `${8 + (audioLevel / 255) * 20 + bar * 2}px`,
              backgroundColor: isSpeaking ? '#ef4444' : '#10b981',
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default AudioInputIndicator;
