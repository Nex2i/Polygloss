import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import App from './app';
import { getNetworkAddress } from './utils/network';
import { logger } from './libs/logger';

dotenv.config();
const PORT: number = Number(process.env.PORT || 3001);

(async () => {
  const app = await App();
  const io = new SocketIOServer(app.server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    path: '/api/chat',
  });

  io.on('connection', (socket) => {
    logger.info('Socket.io client connected');
    socket.on('chat message', (msg) => {
      // Echo the message back to the sender (or broadcast as needed)
      const message = {
        content: msg.content,
        timestamp: new Date().toISOString(),
        senderId: 'SYSTEM_USER',
      };
      socket.emit('chat message', message);
    });
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
