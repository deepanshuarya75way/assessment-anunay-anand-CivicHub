import { BaseRepository } from '../../../core/repositories/base.repository';
import { PostModel, IPostDocument } from './post.model';
import { FilterQuery } from 'mongoose';

export class PostRepository extends BaseRepository<IPostDocument> {
  constructor() {
    super(PostModel);
  }

  async findWithCursor(filter: FilterQuery<IPostDocument>, limit: number, cursor?: Date): Promise<IPostDocument[]> {
    const queryFilter = { ...filter, deletedAt: null };
    
    if (cursor) {
      queryFilter.createdAt = { $lt: cursor };
    }

    return this.model
      .find(queryFilter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}

export const postRepository = new PostRepository();
