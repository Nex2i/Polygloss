import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import App from './app';
import { getNetworkAddress } from './utils/network';
import { logger } from './libs/logger';
import { ChatSocket } from './hubs/chat.socket';

dotenv.config();
const PORT: number = Number(process.env.PORT || 3001);

(async () => {
  const app = await App();
  const chatSocket = new SocketIOServer(app.server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    path: '/api/chat/training',
  });

  chatSocket.on('connection', (socket) => {
    logger.info('Socket.io client connected');
    ChatSocket(socket);
    socket.on('disconnect', () => {
      logger.info('Socket.io client disconnected');
    });
  });

  console.log('PORT from env:', process.env.PORT);
  console.log('PORT:', PORT);

  app.listen({ port: Number(PORT), host: '0.0.0.0' }, () => {
    const networkAddress = getNetworkAddress();
    logger.info(
      `Server running on port ${PORT} \nLocal: https://localhost:${PORT} \nNetwork: https://${networkAddress}:${PORT}`
    );
  });
})();
