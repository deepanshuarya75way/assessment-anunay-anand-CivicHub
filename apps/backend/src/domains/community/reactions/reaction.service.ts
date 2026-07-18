import { reactionRepository } from './reaction.repository';
import { ReactionType } from './reaction.model';
import { EventBus } from '../../../core/events/event.bus';
import { EventTopic } from '../../../core/events/event.types';
import { redis } from '../../../core/config/redis';

export class ReactionService {
  static async toggleReaction(postId: string, userId: string, type: ReactionType) {
    // Check if same type exists to toggle off
    const existing = await reactionRepository.findOne({ postId, userId });
    
    if (existing && existing.type === type) {
      await reactionRepository.removeReaction(postId, userId);
      await EventBus.publish(EventTopic.COMMUNITY_REACTION_UPDATED, { postId, userId, action: 'removed' });
      await redis.decr(`post:${postId}:reactions_count`);
      return { status: 'removed' };
    }

    const { reaction, isNew } = await reactionRepository.upsertReaction(postId, userId, type);
    
    if (isNew) {
      await redis.incr(`post:${postId}:reactions_count`);
      await EventBus.publish(EventTopic.COMMUNITY_REACTION_CREATED, reaction);
    } else {
      await EventBus.publish(EventTopic.COMMUNITY_REACTION_UPDATED, reaction);
    }
    
    return { status: 'added', reaction };
  }
}
