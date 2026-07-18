import { Request, Response, NextFunction } from 'express';
import { SearchService } from './services/search.service';
import { TrendingService } from './services/trending.service';
import { HashtagService } from './services/hashtag.service';
import { ApiResponse } from '../../core/utils/ApiResponse';
import { AuthRequest } from '../../core/middlewares/auth.middleware';
import { SearchResultType } from '@civichub/shared';

export class DiscoveryController {
  static async search(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = req.query.q as string;
      const type = (req.query.type as SearchResultType) || 'all';
      const limit = parseInt(req.query.limit as string) || 20;

      if (!query) {
        return ApiResponse.success(res, [], 'Empty query');
      }

      const results = await SearchService.search(query, type, limit);

      // Async analytics logging
      SearchService.logAnalytics({
        term: query,
        typeSelected: type,
        userId: req.user?.id,
        timestamp: new Date()
      }).catch(err => console.error('Failed to log search analytics', err));

      return ApiResponse.success(res, results);
    } catch (err) {
      next(err);
    }
  }

  static async getTrending(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await TrendingService.getTrendingPosts(5);
      const communities = await TrendingService.getTrendingCommunities(5);
      const hashtags = await HashtagService.getPopularHashtags(5);

      return ApiResponse.success(res, { posts, communities, hashtags });
    } catch (err) {
      next(err);
    }
  }

  static async getHashtag(req: Request, res: Response, next: NextFunction) {
    try {
      const tag = req.params.tag;
      const hashtag = await HashtagService.getHashtag(tag);
      return ApiResponse.success(res, hashtag);
    } catch (err) {
      next(err);
    }
  }

  static async getPopularHashtags(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const hashtags = await HashtagService.getPopularHashtags(limit);
      return ApiResponse.success(res, hashtags);
    } catch (err) {
      next(err);
    }
  }
}
