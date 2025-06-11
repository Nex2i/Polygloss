import { createFileRoute } from '@tanstack/react-router';
import VoiceChat from '../../components/VoiceChat';

export const Route = createFileRoute('/_app/voice-chat')({
  component: VoiceChat,
});
