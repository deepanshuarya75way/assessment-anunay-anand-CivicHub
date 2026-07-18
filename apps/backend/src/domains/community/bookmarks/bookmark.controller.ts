import { Request, Response, NextFunction } from 'express';
import { BookmarkService } from './bookmark.service';
import { ApiResponse } from '../../../core/utils/ApiResponse';
import { AuthRequest } from '../../../core/middlewares/auth.middleware';

export class BookmarkController {
  static async toggle(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const userId = req.user!.id;

      const result = await BookmarkService.toggleBookmark(postId, userId);
      return ApiResponse.success(res, result, 'Bookmark toggled');
    } catch (err) {
      next(err);
    }
  }

  static async getMyBookmarks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const limit = parseInt(req.query.limit as string) || 20;
      const cursorStr = req.query.cursor as string;
      const cursor = cursorStr ? new Date(cursorStr) : undefined;

      const bookmarks = await BookmarkService.getBookmarksForUser(userId, limit, cursor);
      return ApiResponse.success(res, bookmarks, 'Bookmarks fetched');
    } catch (err) {
      next(err);
    }
  }
}
