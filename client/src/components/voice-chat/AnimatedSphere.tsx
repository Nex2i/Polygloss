import React from 'react';

interface AnimatedSphereProps {
  audioLevel: number;
  isSpeaking: boolean;
  isConnected: boolean;
}

const AnimatedSphere: React.FC<AnimatedSphereProps> = ({ audioLevel, isSpeaking, isConnected }) => {
  const sphereScale = 1 + (audioLevel / 255) * 0.3; // Scale based on audio level
  const pulseIntensity = isSpeaking ? 'animate-pulse' : '';
  const glowIntensity = isConnected ? 20 + audioLevel / 10 : 5;

  return (
    <div className="flex items-center justify-center mb-8">
      <div
        className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 shadow-lg transition-transform duration-150 ${pulseIntensity}`}
        style={{
          transform: `scale(${sphereScale})`,
          boxShadow: `0 0 ${glowIntensity}px rgba(59, 130, 246, 0.5)`,
          background: isSpeaking
            ? 'linear-gradient(45deg, #10b981, #06b6d4, #8b5cf6)'
            : 'linear-gradient(45deg, #60a5fa, #a855f7)',
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-white/20 to-transparent"></div>
      </div>
    </div>
  );
};

export default AnimatedSphere;
