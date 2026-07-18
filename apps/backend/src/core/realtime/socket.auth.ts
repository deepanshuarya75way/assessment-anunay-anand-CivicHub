import { Socket } from 'socket.io';
import { JwtService } from '../security/jwt.service';
import { redis } from '../config/redis';

export const socketAuthMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = JwtService.verifyToken<any>(token);

    if (decoded.jti) {
      const isBlacklisted = await redis.get(`bl_${decoded.jti}`);
      if (isBlacklisted) {
        return next(new Error('Token revoked'));
      }
    }

    // Attach user to socket
    socket.data.user = decoded;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};
