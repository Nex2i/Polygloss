import { useState, useRef, useEffect, useCallback } from 'react';
import { useConversation, type SessionConfig } from '@elevenlabs/react';
import { VoiceChatHeader, SetupScreen, ConnectingScreen, ConversationScreen } from './voice-chat';
import { useElevenLabsSignedUrl } from '../hooks/useElevenLabsSignedUrl';

interface VoiceChatProps {}

const VoiceChat: React.FC<VoiceChatProps> = () => {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [conversationStarted, setConversationStarted] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Hook for getting signed URL from authenticated endpoint
  const signedUrlMutation = useElevenLabsSignedUrl();

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

  // Handle page visibility changes to prevent disconnection when switching tabs
  useEffect(() => {
    const handleVisibilityChange = async () => {
      console.log(
        '🔄 [VISIBILITY] Page visibility changed:',
        document.hidden ? 'hidden' : 'visible'
      );

      if (audioContextRef.current && conversationStarted) {
        if (document.hidden) {
          // Tab is hidden - suspend audio context but keep conversation alive
          if (audioContextRef.current.state === 'running') {
            console.log('⏸️ [VISIBILITY] Suspending audio context');
            try {
              await audioContextRef.current.suspend();
            } catch (error) {
              console.warn('⚠️ [VISIBILITY] Failed to suspend audio context:', error);
            }
          }
        } else {
          // Tab is visible again - resume audio context
          if (audioContextRef.current.state === 'suspended') {
            console.log('▶️ [VISIBILITY] Resuming audio context');
            try {
              await audioContextRef.current.resume();
              // Restart audio monitoring if it was stopped
              if (!animationRef.current) {
                monitorAudioLevel();
              }
            } catch (error) {
              console.warn('⚠️ [VISIBILITY] Failed to resume audio context:', error);
              // If resume fails, the context might be closed, so we don't restart monitoring
            }
          } else if (audioContextRef.current.state === 'closed') {
            console.log('ℹ️ [VISIBILITY] Audio context is closed, cannot resume');
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [conversationStarted]);

  // Initialize audio context for voice input detection
  const initializeAudio = async () => {
    try {
      console.log('🎤 [AUDIO] Requesting microphone permission...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('🎤 [AUDIO] Microphone permission granted, stream:', stream);
      console.log(
        '🎤 [AUDIO] Stream tracks:',
        stream.getTracks().map((track) => ({
          kind: track.kind,
          enabled: track.enabled,
          readyState: track.readyState,
        }))
      );

      // Store the media stream reference for cleanup
      mediaStreamRef.current = stream;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      monitorAudioLevel();
    } catch (error) {
      console.error('❌ [AUDIO] Error accessing microphone:', error);
      if (error instanceof Error) {
        console.error('❌ [AUDIO] Error name:', error.name);
        console.error('❌ [AUDIO] Error message:', error.message);
      }
    }
  };

  // Monitor audio input levels for visual feedback
  const monitorAudioLevel = () => {
    if (!analyserRef.current) {
      console.log('📊 [AUDIO_MONITOR] No analyser available, returning');
      return;
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const updateAudioLevel = () => {
      if (analyserRef.current && conversation.status === 'connected' && audioContextRef.current) {
        // Only update if audio context is running and tab is visible
        if (audioContextRef.current.state === 'running' && !document.hidden) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
          // Only log every 60 frames to avoid spam
          if (Math.random() < 0.01) {
            // ~1% of the time
            console.log('📊 [AUDIO_MONITOR] Audio level:', average, 'Status:', conversation.status);
          }
        } else {
          // Set audio level to 0 when context is suspended or tab is hidden
          setAudioLevel(0);
          if (Math.random() < 0.01) {
            // ~1% of the time
            console.log(
              '📊 [AUDIO_MONITOR] Skipping update - context state:',
              audioContextRef.current?.state,
              'tab hidden:',
              document.hidden,
              'status:',
              conversation.status
            );
          }
        }
      } else {
        if (Math.random() < 0.01) {
          // ~1% of the time
          console.log(
            '📊 [AUDIO_MONITOR] Skipping update - analyser:',
            !!analyserRef.current,
            'status:',
            conversation.status,
            'audioContext:',
            !!audioContextRef.current
          );
        }
      }
      animationRef.current = requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();
    console.log('📊 [AUDIO_MONITOR] Audio monitoring started');
  };

  // Clean up audio context
  const cleanupAudio = useCallback(() => {
    console.log('🧹 [CLEANUP] Starting audio cleanup');

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log('🧹 [CLEANUP] Stopped media stream track:', track.kind);
      });
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      console.log(
        '🧹 [CLEANUP] Closing audio context, current state:',
        audioContextRef.current.state
      );
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setAudioLevel(0);
  }, [setAudioLevel]);

  // Connect to Eleven Labs
  const connectToElevenLabs = async () => {
    if (selectedLevel < 1 || selectedLevel > 10) {
      console.error('❌ [CONNECTION] Invalid lesson level:', selectedLevel);
      alert('Please select a valid lesson level (1-10)');
      return;
    }

    setIsConnecting(true);

    try {
      // Request microphone permission first
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Stop the stream since initializeAudio will create its own
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log('🚀 [CONNECTION] Stopped initial stream track:', track.kind);
      });

      await initializeAudio();

      const signedUrlData = await signedUrlMutation.mutateAsync({
        lessonLevel: selectedLevel,
      });

      const sessionConfig: SessionConfig = {
        signedUrl: signedUrlData.signedUrl,
        dynamicVariables: {
          skill_level: signedUrlData.lessonLevel ?? 3,
        },
      };

      console.log('🚀 [CONNECTION] Session config', sessionConfig);

      await conversation.startSession(sessionConfig);
    } catch (error) {
      console.error('❌ [CONNECTION] Failed to connect to Eleven Labs:', error);
      if (error instanceof Error) {
        console.error('❌ [CONNECTION] Error name:', error.name);
        console.error('❌ [CONNECTION] Error message:', error.message);
        console.error('❌ [CONNECTION] Error stack:', error.stack);
      }
      console.error('❌ [CONNECTION] Full error object:', JSON.stringify(error, null, 2));

      setIsConnecting(false);
      setConversationStarted(false);
      cleanupAudio();

      // Show user-friendly error message based on error type
      if (error instanceof Error && error.message.includes('Failed to get signed URL')) {
        alert(
          'Failed to authenticate with the voice AI service. Please make sure you are logged in and try again.'
        );
      } else {
        alert(
          'Failed to connect to the voice AI. Please check your microphone permissions and try again.'
        );
      }
    }
  };

  // Disconnect from Eleven Labs
  const disconnect = useCallback(async () => {
    console.log('🔌 [DISCONNECT] Disconnecting from Eleven Labs');
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('❌ [DISCONNECT] Error ending session:', error);
      if (error instanceof Error) {
        console.error('❌ [DISCONNECT] Error name:', error.name);
        console.error('❌ [DISCONNECT] Error message:', error.message);
      }
    }

    cleanupAudio();
    setConversationStarted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return (
    <div id="voice-chat" className="flex flex-col h-screen bg-gray-100">
      <VoiceChatHeader />

      {/* Main Content */}
      <div className="flex-grow p-4 flex flex-col justify-center">
        {!conversationStarted && !isConnecting ? (
          <SetupScreen
            selectedLevel={selectedLevel}
            onLevelChange={setSelectedLevel}
            onConnect={connectToElevenLabs}
            isConnecting={isConnecting}
          />
        ) : isConnecting ? (
          <ConnectingScreen selectedLevel={selectedLevel} />
        ) : (
          <ConversationScreen
            selectedLevel={selectedLevel}
            audioLevel={audioLevel}
            isSpeaking={conversation.isSpeaking}
            isConnected={conversation.status === 'connected'}
            onDisconnect={disconnect}
          />
        )}
      </div>
    </div>
  );
};

export default VoiceChat;
