import { BaseRepository } from '../../../core/repositories/base.repository';
import { CommentModel, ICommentDocument } from './comment.model';
import { FilterQuery } from 'mongoose';

export class CommentRepository extends BaseRepository<ICommentDocument> {
  constructor() {
    super(CommentModel);
  }

  async findByTarget(targetId: string, targetType: string, limit: number, cursor?: Date): Promise<ICommentDocument[]> {
    const filter: FilterQuery<ICommentDocument> = { targetId, targetType, parentId: { $exists: false }, deletedAt: null };
    if (cursor) {
      filter.createdAt = { $gt: cursor };
    }
    return this.model.find(filter).sort({ createdAt: 1 }).limit(limit).exec();
  }

  async findReplies(parentId: string, limit: number, cursor?: Date): Promise<ICommentDocument[]> {
    const filter: FilterQuery<ICommentDocument> = { parentId, deletedAt: null };
    if (cursor) {
      filter.createdAt = { $gt: cursor };
    }
    return this.model.find(filter).sort({ createdAt: 1 }).limit(limit).exec();
  }
}

export const commentRepository = new CommentRepository();
