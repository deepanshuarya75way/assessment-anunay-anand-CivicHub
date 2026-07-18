import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../../core/utils/ApiResponse';
import { AuthRequest } from '../../../core/middlewares/auth.middleware';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../../../core/config/env';

// Configure Cloudinary once
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'test',
  api_key: process.env.CLOUDINARY_API_KEY || 'test',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'test',
});

export class MediaController {
  static async generateUploadToken(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      
      // Add a folder structure based on user ID or community
      const folder = `civichub/users/${req.user!.id}`;
      
      const signature = cloudinary.utils.api_sign_request(
        {
          timestamp,
          folder,
        },
        process.env.CLOUDINARY_API_SECRET || 'test'
      );

      return ApiResponse.success(res, {
        signature,
        timestamp,
        folder,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
      }, 'Upload token generated');
    } catch (err) {
      next(err);
    }
  }
}
