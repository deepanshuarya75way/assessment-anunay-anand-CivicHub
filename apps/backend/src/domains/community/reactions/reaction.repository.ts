import { BaseRepository } from '../../../core/repositories/base.repository';
import { ReactionModel, IReactionDocument, ReactionType } from './reaction.model';

export class ReactionRepository extends BaseRepository<IReactionDocument> {
  constructor() {
    super(ReactionModel);
  }

  async upsertReaction(postId: string, userId: string, type: ReactionType): Promise<{ reaction: IReactionDocument; isNew: boolean }> {
    const existing = await this.model.findOne({ postId, userId });
    
    if (existing) {
      existing.type = type;
      await existing.save();
      return { reaction: existing, isNew: false };
    }

    const reaction = await this.create({ postId: postId as any, userId: userId as any, type } as any);
    return { reaction, isNew: true };
  }

  async removeReaction(postId: string, userId: string) {
    return this.model.findOneAndDelete({ postId, userId });
  }

  async countByPost(postId: string) {
    return this.model.aggregate([
      { $match: { postId: postId as any } }, // Type casting for mongoose aggregation
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
  }
}

export const reactionRepository = new ReactionRepository();
