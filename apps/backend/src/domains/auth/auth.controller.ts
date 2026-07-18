import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../core/middlewares/auth.middleware';
import { AuthService } from './services/auth.service';
import { ApiResponse } from '../../core/utils/ApiResponse';
import { UserRegistrationSchema, LoginSchema, VerifyEmailSchema, RefreshTokenSchema } from '@civichub/shared';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = UserRegistrationSchema.parse(req.body);
      const result = await AuthService.register(data);
      return ApiResponse.success(res, null, result.message, 201);
    } catch (err) {
      next(err);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.query;
      const data = VerifyEmailSchema.parse(req.body);
      const result = await AuthService.verifyEmail(uid as string, data.token);
      return ApiResponse.success(res, null, result.message);
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = LoginSchema.parse(req.body);
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      
      const result = await AuthService.login(data, ip, userAgent);
      
      // Optionally set refresh token as httpOnly secure cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return ApiResponse.success(res, { accessToken: result.accessToken, user: result.user }, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      // Allow token from body or cookie
      const token = req.cookies.refreshToken || req.body.refreshToken;
      if (!token) throw new Error('Refresh token missing');

      const data = RefreshTokenSchema.parse({ refreshToken: token });
      const result = await AuthService.refresh(data.refreshToken);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return ApiResponse.success(res, { accessToken: result.accessToken }, 'Token refreshed');
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;
      const authHeader = req.headers.authorization;
      const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

      if (token || accessToken) {
        await AuthService.logout(token, accessToken);
      }
      res.clearCookie('refreshToken');
      return ApiResponse.success(res, null, 'Logged out successfully');
    } catch (err) {
      next(err);
    }
  }

  static async logoutAllDevices(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error('User not found');
      await AuthService.logoutAllDevices(req.user.id);
      res.clearCookie('refreshToken');
      return ApiResponse.success(res, null, 'Logged out from all devices successfully');
    } catch (err) {
      next(err);
    }
  }
}
