import { Server as SocketIOServer } from 'socket.io';
import App from './app';
import { PORT } from './config';
import { getNetworkAddress } from './utils/network';
import { logger } from './libs/logger';

(async () => {
  const { httpServer } = await App();
  const io = new SocketIOServer(httpServer, {
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

  httpServer.listen(Number(PORT) || 3000, '0.0.0.0', () => {
    const networkAddress = getNetworkAddress();
    logger.info(
      `Server running on port ${PORT} \nLocal: http://localhost:${PORT} \nNetwork: http://${networkAddress}:${PORT}`
    );
  });
})();
