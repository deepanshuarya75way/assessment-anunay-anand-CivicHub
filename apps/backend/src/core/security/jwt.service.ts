import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export class JwtService {
  static generateToken(payload: object, expiresIn: string | number = '15m'): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: expiresIn as any });
  }

  static verifyToken<T>(token: string): T {
    return jwt.verify(token, env.JWT_SECRET) as T;
  }
}
