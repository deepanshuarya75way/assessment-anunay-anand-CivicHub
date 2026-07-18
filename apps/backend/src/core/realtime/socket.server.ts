import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { socketAuthMiddleware } from './socket.auth';
import { SocketGateway } from './socket.gateway';
import { SocketEvents } from './socket.events';
import { SocketRooms } from './socket.rooms';
import { logger } from '../logging/logger';

export let io: SocketIOServer;

export const initializeRealtime = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
    },
  });

  // Authentication
  io.use(socketAuthMiddleware);

  io.on(SocketEvents.CONNECTION, (socket) => {
    logger.debug(`[Socket] User connected: ${socket.data.user?.id}`);

    // Automatically join user's private room
    socket.join(SocketRooms.userRoom(socket.data.user.id));

    // Handle joining a specific post room (for live comments/reactions)
    socket.on(SocketEvents.JOIN_ROOM, (roomId: string) => {
      socket.join(roomId);
      logger.debug(`[Socket] User ${socket.data.user.id} joined room ${roomId}`);
    });

    socket.on(SocketEvents.LEAVE_ROOM, (roomId: string) => {
      socket.leave(roomId);
    });

    socket.on(SocketEvents.DISCONNECT, () => {
      logger.debug(`[Socket] User disconnected: ${socket.data.user?.id}`);
    });
  });

  const gateway = new SocketGateway(io);
  gateway.startListening();

  logger.info('[Realtime] Socket.IO server initialized');
};
