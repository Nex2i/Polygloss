import { createFileRoute } from '@tanstack/react-router';
import TrainingChat from '../components/TrainingChat';

export const Route = createFileRoute('/trainingchat')({
  component: TrainingChat,
});
