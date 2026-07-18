import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../security/jwt.service';
import { redis } from '../config/redis';
import { UserModel } from '../../domains/identity/models/user.model';
import { AuthenticationError, AuthorizationError } from '../exceptions';
import { Role, Permission } from '@civichub/shared';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
    permissions: Permission[];
    tokenVersion?: number;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];
    const decoded = JwtService.verifyToken<any>(token);

    if (decoded.jti) {
      const isBlacklisted = await redis.get(`bl_${decoded.jti}`);
      if (isBlacklisted) {
        throw new AuthenticationError('Token revoked');
      }
    }

    const user = await UserModel.findById(decoded.id);
    if (!user || user.status === 'BANNED' || user.status === 'DELETED') {
      throw new AuthenticationError('User not found or inactive');
    }

    if (decoded.tokenVersion !== undefined && user.tokenVersion !== decoded.tokenVersion) {
      throw new AuthenticationError('Token revoked by newer session');
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(new AuthenticationError('Invalid or expired token'));
  }
};

export const requireRole = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AuthorizationError());
    }
    next();
  };
};

export const requirePermission = (permission: Permission) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.permissions.includes(permission)) {
      return next(new AuthorizationError(`Missing permission: ${permission}`));
    }
    next();
  };
};
