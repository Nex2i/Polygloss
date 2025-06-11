import { useState, useRef, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useConversation } from '@elevenlabs/react';

interface VoiceChatProps {}

const VoiceChat: React.FC<VoiceChatProps> = () => {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [conversationStarted, setConversationStarted] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  // Initialize Eleven Labs conversation
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to Eleven Labs');
      setIsConnecting(false);
      setConversationStarted(true);
    },
    onDisconnect: () => {
      console.log('Disconnected from Eleven Labs');
      setConversationStarted(false);
      setIsConnecting(false);
      cleanupAudio();
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      setIsConnecting(false);
      setConversationStarted(false);
    },
    onMessage: (message) => {
      console.log('Message received:', message);
    },
  });

  // Generate lesson level options (1-10)
  const lessonLevels = Array.from({ length: 10 }, (_, i) => i + 1);

  // Initialize audio context for voice input detection
  const initializeAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      // Start monitoring audio levels
      monitorAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Monitor audio input levels for visual feedback
  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateAudioLevel = () => {
      if (analyserRef.current && conversation.status === 'connected') {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average);
      }
      animationRef.current = requestAnimationFrame(updateAudioLevel);
    };
    
    updateAudioLevel();
  };

  // Clean up audio context
  const cleanupAudio = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setAudioLevel(0);
  };

  // Connect to Eleven Labs
  const connectToElevenLabs = async () => {
    if (selectedLevel < 1 || selectedLevel > 10) {
      alert('Please select a valid lesson level (1-10)');
      return;
    }

    setIsConnecting(true);
    
    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Initialize audio monitoring
      await initializeAudio();
      
      // For demonstration purposes, using a placeholder agent ID
      // In production, you would either:
      // 1. Use a public agent ID directly
      // 2. Get a signed URL from your backend for private agents
      const agentId = 'your-agent-id-here'; // Replace with your actual agent ID
      
      await conversation.startSession({
        agentId: agentId,
        // You can add custom variables based on lesson level
        overrides: {
          agent: {
            prompt: {
              prompt: `You are a Spanish language tutor conducting a conversation at level ${selectedLevel} (1-10 scale, where 1 is beginner and 10 is advanced). Adjust your vocabulary, grammar complexity, and speaking pace accordingly. Focus on helping the student practice speaking Spanish through natural conversation.`
            }
          }
        }
      });
      
    } catch (error) {
      console.error('Failed to connect to Eleven Labs:', error);
      setIsConnecting(false);
      setConversationStarted(false);
      cleanupAudio();
      
      // Show user-friendly error message
      alert('Failed to connect to the voice AI. Please check your microphone permissions and try again.');
    }
  };

  // Disconnect from Eleven Labs
  const disconnect = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Error ending session:', error);
    }
    cleanupAudio();
    setConversationStarted(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  // Animated sphere component
  const AnimatedSphere = () => {
    const sphereScale = 1 + (audioLevel / 255) * 0.3; // Scale based on audio level
    const pulseIntensity = conversation.isSpeaking ? 'animate-pulse' : '';
    const glowIntensity = conversation.status === 'connected' ? 20 + audioLevel / 10 : 5;
    
    return (
      <div className="flex items-center justify-center mb-8">
        <div
          className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 shadow-lg transition-transform duration-150 ${pulseIntensity}`}
          style={{
            transform: `scale(${sphereScale})`,
            boxShadow: `0 0 ${glowIntensity}px rgba(59, 130, 246, 0.5)`,
            background: conversation.isSpeaking 
              ? 'linear-gradient(45deg, #10b981, #06b6d4, #8b5cf6)' 
              : 'linear-gradient(45deg, #60a5fa, #a855f7)'
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-white/20 to-transparent"></div>
        </div>
      </div>
    );
  };

  // Audio input indicator
  const AudioInputIndicator = () => {
    const bars = Array.from({ length: 5 }, (_, i) => i);
    const isListening = conversation.status === 'connected' && !conversation.isSpeaking;
    
    return (
      <div className="flex items-center space-x-1 mb-4">
        <span className="text-sm text-gray-600 mr-2">
          {conversation.isSpeaking ? 'AI Speaking...' : isListening ? 'Listening...' : 'Not listening'}
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
                backgroundColor: conversation.isSpeaking ? '#ef4444' : '#10b981'
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  };

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
          onClick={() => router.navigate({ to: '/dashboard' })}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <h1 className="flex-grow text-center text-xl font-semibold text-gray-800">
          Voice Chat with AI
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 flex flex-col items-center justify-center">
        {!conversationStarted && !isConnecting ? (
          // Setup Screen
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
              Start Voice Conversation
            </h2>
            
            {/* Lesson Level Dropdown */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Lesson Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {lessonLevels.map((level) => (
                  <option key={level} value={level}>
                    Level {level} {level <= 3 ? '(Beginner)' : level <= 6 ? '(Intermediate)' : '(Advanced)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Connect Button */}
            <button
              onClick={connectToElevenLabs}
              disabled={isConnecting}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Connect to Eleven Labs
            </button>
            
            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This demo requires an Eleven Labs agent ID. 
                Please replace 'your-agent-id-here' in the code with your actual agent ID from the Eleven Labs dashboard.
              </p>
            </div>
          </div>
        ) : isConnecting ? (
          // Connecting Screen
          <div className="w-full max-w-md flex flex-col items-center">
            <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
              Connecting to Eleven Labs...
            </h2>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-center">
              Setting up your Level {selectedLevel} conversation
            </p>
          </div>
        ) : (
          // Conversation Screen
          <div className="w-full max-w-md flex flex-col items-center">
            <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
              Level {selectedLevel} Conversation
            </h2>
            
            {/* Animated Sphere */}
            <AnimatedSphere />
            
            {/* Audio Input Indicator */}
            <AudioInputIndicator />
            
            {/* Connection Status */}
            <div className={`text-sm mb-6 ${conversation.status === 'connected' ? 'text-green-600' : 'text-red-500'}`}>
              {conversation.status === 'connected' ? '🟢 Connected to Eleven Labs' : '🔴 Disconnected'}
            </div>
            
            {/* AI Status */}
            {conversation.isSpeaking && (
              <div className="text-sm mb-4 text-purple-600 font-medium">
                🗣️ AI is speaking...
              </div>
            )}
            
            {/* Controls */}
            <div className="flex space-x-4">
              <button
                onClick={disconnect}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                End Session
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-white border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Powered by Eleven Labs AI • Voice conversation practice
        </p>
      </div>
    </div>
  );
};

export default VoiceChat;