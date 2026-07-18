import { Request, Response, NextFunction } from 'express';
import { IdentityService } from './services/identity.service';
import { ProfileService } from './services/profile.service';
import { PreferencesService } from './services/preferences.service';
import { ActivityService } from './services/activity.service';
import { ApiResponse } from '../../core/utils/ApiResponse';
import { AuthRequest } from '../../core/middlewares/auth.middleware';
import { UserUpdateProfileSchema, ProfileUpdateSchema, PreferencesUpdateSchema } from '@civichub/shared';

export class IdentityController {
  // Identity/User Routes
  static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await IdentityService.getProfile(req.user!.id);
      return ApiResponse.success(res, user);
    } catch (err) {
      next(err);
    }
  }

  static async updateMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = UserUpdateProfileSchema.parse(req.body);
      const user = await IdentityService.updateProfile(req.user!.id, data);
      return ApiResponse.success(res, user, 'User updated successfully');
    } catch (err) {
      next(err);
    }
  }

  static async deleteMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await IdentityService.deleteAccount(req.user!.id);
      res.clearCookie('refreshToken');
      return ApiResponse.success(res, null, 'Account deleted successfully');
    } catch (err) {
      next(err);
    }
  }

  // Profile Routes
  static async getProfileByUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await ProfileService.getProfileByUsername(req.params.username);
      return ApiResponse.success(res, profile);
    } catch (err) {
      next(err);
    }
  }

  static async getMyProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await ProfileService.getProfileByUserId(req.user!.id);
      return ApiResponse.success(res, profile);
    } catch (err) {
      next(err);
    }
  }

  static async updateMyProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = ProfileUpdateSchema.parse(req.body);
      const profile = await ProfileService.updateProfile(req.user!.id, data);
      return ApiResponse.success(res, profile, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  }

  static async checkUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.query;
      if (!username || typeof username !== 'string') {
        return res.status(400).json({ success: false, error: 'Username query parameter is required' });
      }
      const isAvailable = await ProfileService.checkUsernameAvailability(username);
      return ApiResponse.success(res, { isAvailable });
    } catch (err) {
      next(err);
    }
  }
  
  static async updateUsername(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { username } = req.body;
      if (!username || typeof username !== 'string') {
        return res.status(400).json({ success: false, error: 'Username is required' });
      }
      const profile = await ProfileService.updateUsername(req.user!.id, username);
      return ApiResponse.success(res, profile, 'Username updated successfully');
    } catch (err) {
      next(err);
    }
  }

  // Activity Routes
  static async getUserActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const activity = await ActivityService.getUserActivity(req.params.username);
      return ApiResponse.success(res, activity);
    } catch (err) {
      next(err);
    }
  }

  // Preferences Routes
  static async getMyPreferences(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const prefs = await PreferencesService.getPreferences(req.user!.id);
      return ApiResponse.success(res, prefs);
    } catch (err) {
      next(err);
    }
  }

  static async updateMyPreferences(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = PreferencesUpdateSchema.parse(req.body);
      const prefs = await PreferencesService.updatePreferences(req.user!.id, data);
      return ApiResponse.success(res, prefs, 'Preferences updated successfully');
    } catch (err) {
      next(err);
    }
  }
}
