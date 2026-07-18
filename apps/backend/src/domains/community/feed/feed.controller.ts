import { Request, Response, NextFunction } from 'express';
import { FeedService } from './feed.service';
import { ApiResponse } from '../../../core/utils/ApiResponse';
import { AuthRequest } from '../../../core/middlewares/auth.middleware';

export class FeedController {
  static async getFeed(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const cursorStr = req.query.cursor as string;
      const cursor = cursorStr ? new Date(cursorStr) : undefined;
      const spaceType = req.query.spaceType as string;
      const spaceId = req.query.spaceId as string;
      
      const feed = await FeedService.getChronologicalFeed(limit, cursor, spaceType, spaceId);
      return ApiResponse.success(res, feed, 'Feed fetched');
    } catch (err) {
      next(err);
    }
  }
}
