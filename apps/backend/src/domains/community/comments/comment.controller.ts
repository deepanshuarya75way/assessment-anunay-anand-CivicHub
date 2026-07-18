import { Request, Response, NextFunction } from 'express';
import { CommentService } from './comment.service';
import { ApiResponse } from '../../../core/utils/ApiResponse';
import { AuthRequest } from '../../../core/middlewares/auth.middleware';
import { UserModel } from '../../identity/models/user.model';
import mongoose from 'mongoose';

export class CommentController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { text, parentId, targetType = 'post', isOfficial, organizationId } = req.body;
      const { targetId } = req.params;
      const userId = req.user!.id;

      const user = await UserModel.findById(userId);
      if (!user) throw new Error('User not found');

      const commentData: any = {
        targetId: new mongoose.Types.ObjectId(targetId),
        targetType,
        author: {
          userId: new mongoose.Types.ObjectId(userId),
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: (user as any).avatarUrl,
        },
        content: { text, mentions: [] },
      };

      if (isOfficial) {
        commentData.isOfficial = true;
        if (organizationId) commentData.organizationId = new mongoose.Types.ObjectId(organizationId);
      }

      if (parentId) {
        commentData.parentId = new mongoose.Types.ObjectId(parentId);
      }

      const comment = await CommentService.createComment(commentData);
      return ApiResponse.success(res, comment, 'Comment created', 201);
    } catch (err) {
      next(err);
    }
  }

  static async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const { targetId } = req.params;
      const targetType = (req.query.targetType as string) || 'post';
      const limit = parseInt(req.query.limit as string) || 20;
      const cursorStr = req.query.cursor as string;
      const cursor = cursorStr ? new Date(cursorStr) : undefined;

      const comments = await CommentService.getCommentsForTarget(targetId, targetType, limit, cursor);
      return ApiResponse.success(res, comments, 'Comments fetched');
    } catch (err) {
      next(err);
    }
  }

  static async getReplies(req: Request, res: Response, next: NextFunction) {
    try {
      const { commentId } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      const cursorStr = req.query.cursor as string;
      const cursor = cursorStr ? new Date(cursorStr) : undefined;

      const replies = await CommentService.getRepliesForComment(commentId, limit, cursor);
      return ApiResponse.success(res, replies, 'Replies fetched');
    } catch (err) {
      next(err);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { commentId } = req.params;
      const { text } = req.body;
      const userId = req.user!.id;

      const comment = await CommentService.updateComment(commentId, userId, text);
      return ApiResponse.success(res, comment, 'Comment updated');
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { commentId } = req.params;
      const userId = req.user!.id;

      await CommentService.deleteComment(commentId, userId);
      return ApiResponse.success(res, null, 'Comment deleted');
    } catch (err) {
      next(err);
    }
  }
}
