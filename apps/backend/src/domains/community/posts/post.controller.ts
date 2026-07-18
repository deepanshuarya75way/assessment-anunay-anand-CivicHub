import { Request, Response, NextFunction } from 'express';
import { PostService } from './post.service';
import { ApiResponse } from '../../../core/utils/ApiResponse';
import { AuthRequest } from '../../../core/middlewares/auth.middleware';
import { UserModel } from '../../identity/models/user.model';
import mongoose from 'mongoose';

export class PostController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { content, attachments, visibility } = req.body;
      const userId = req.user!.id;
      
      const user = await UserModel.findById(userId);
      if (!user) throw new Error('User not found');

      const postData = {
        author: {
          userId: new mongoose.Types.ObjectId(userId),
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: (user as any).avatarUrl,
        },
        content,
        attachments: attachments || [],
        visibility,
      };

      const post = await PostService.createPost(postData);
      return ApiResponse.success(res, post, 'Post created', 201);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { content, attachments, visibility } = req.body;
      
      const post = await PostService.updatePost(id, userId, { content, attachments, visibility });
      return ApiResponse.success(res, post, 'Post updated');
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      await PostService.deletePost(id, userId);
      return ApiResponse.success(res, null, 'Post deleted');
    } catch (err) {
      next(err);
    }
  }
}
