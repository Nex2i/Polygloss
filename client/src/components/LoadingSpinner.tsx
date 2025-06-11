import { useEffect, useState } from 'react';

export const LoadingSpinner: React.FC = () => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 3);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f7f9fb] w-screen max-w-[100vw] h-screen max-h-[100vh] overflow-hidden">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width="96"
          height="96"
          className="animate-pulse"
        >
          {/* Background circle */}
          <circle cx="32" cy="32" r="30" fill="#4F46E5" stroke="#3730A3" strokeWidth="2" />

          {/* Speech bubble 1 - animated */}
          <circle
            cx="24"
            cy="24"
            r="8"
            fill="#FFFFFF"
            opacity={animationPhase === 0 ? '0.9' : '0.3'}
            className="transition-opacity duration-300"
          />
          <polygon
            points="24,32 20,36 28,36"
            fill="#FFFFFF"
            opacity={animationPhase === 0 ? '0.9' : '0.3'}
            className="transition-opacity duration-300"
          />

          {/* Speech bubble 2 - animated */}
          <circle
            cx="44"
            cy="36"
            r="6"
            fill="#F59E0B"
            opacity={animationPhase === 1 ? '0.9' : '0.3'}
            className="transition-opacity duration-300"
          />
          <polygon
            points="44,42 41,46 47,46"
            fill="#F59E0B"
            opacity={animationPhase === 1 ? '0.9' : '0.3'}
            className="transition-opacity duration-300"
          />

          {/* Text elements representing different languages */}
          <text
            x="24"
            y="28"
            fontFamily="Arial, sans-serif"
            fontSize="8"
            fill="#4F46E5"
            fontWeight="bold"
            textAnchor="middle"
            opacity={animationPhase === 0 ? '1' : '0.4'}
            className="transition-opacity duration-300"
          >
            A
          </text>
          <text
            x="44"
            y="40"
            fontFamily="Arial, sans-serif"
            fontSize="6"
            fill="#FFFFFF"
            fontWeight="bold"
            textAnchor="middle"
            opacity={animationPhase === 1 ? '1' : '0.4'}
            className="transition-opacity duration-300"
          >
            ñ
          </text>

          {/* Microphone icon - animated */}
          <rect
            x="30"
            y="48"
            width="4"
            height="8"
            rx="2"
            fill="#FFFFFF"
            opacity={animationPhase === 2 ? '1' : '0.5'}
            className="transition-opacity duration-300"
          />
          <rect
            x="28"
            y="44"
            width="8"
            height="6"
            rx="3"
            fill="#FFFFFF"
            opacity={animationPhase === 2 ? '1' : '0.5'}
            className="transition-opacity duration-300"
          />
          <line
            x1="32"
            y1="56"
            x2="32"
            y2="60"
            stroke="#FFFFFF"
            strokeWidth="2"
            opacity={animationPhase === 2 ? '1' : '0.5'}
            className="transition-opacity duration-300"
          />
          <line
            x1="28"
            y1="60"
            x2="36"
            y2="60"
            stroke="#FFFFFF"
            strokeWidth="2"
            opacity={animationPhase === 2 ? '1' : '0.5'}
            className="transition-opacity duration-300"
          />
        </svg>
      </div>
    </div>
  );
};
