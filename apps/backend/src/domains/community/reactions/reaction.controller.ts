import { Request, Response, NextFunction } from 'express';
import { ReactionService } from './reaction.service';
import { ApiResponse } from '../../../core/utils/ApiResponse';
import { AuthRequest } from '../../../core/middlewares/auth.middleware';
import { ReactionType } from './reaction.model';

export class ReactionController {
  static async toggle(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const { type } = req.body;
      const userId = req.user!.id;

      if (!Object.values(ReactionType).includes(type)) {
        throw new Error('Invalid reaction type');
      }

      const result = await ReactionService.toggleReaction(postId, userId, type);
      return ApiResponse.success(res, result, 'Reaction toggled');
    } catch (err) {
      next(err);
    }
  }
}
