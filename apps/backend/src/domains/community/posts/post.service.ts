import { postRepository } from './post.repository';
import { IPostDocument } from './post.model';
import { EventBus } from '../../../core/events/event.bus';
import { EventTopic } from '../../../core/events/event.types';
import { NotFoundError, AuthorizationError } from '../../../core/exceptions';
import { redis } from '../../../core/config/redis';

export class PostService {
  private static CACHE_TTL = 3600; // 1 hour

  static async createPost(data: Partial<IPostDocument>) {
    const post = await postRepository.create(data);
    
    // Cache the post
    await redis.setex(`post:${post._id}`, this.CACHE_TTL, JSON.stringify(post));

    // Emit event
    await EventBus.publish(EventTopic.COMMUNITY_POST_CREATED, {
      postId: post._id,
      authorId: post.author.userId,
    });

    return post;
  }

  static async getPostById(postId: string) {
    const cached = await redis.get(`post:${postId}`);
    if (cached) return JSON.parse(cached);

    const post = await postRepository.findOne({ _id: postId, deletedAt: null });
    if (!post) throw new NotFoundError('Post not found');

    await redis.setex(`post:${postId}`, this.CACHE_TTL, JSON.stringify(post));
    return post;
  }

  static async updatePost(postId: string, userId: string, updateData: any) {
    const post = await this.getPostById(postId);
    
    if (post.author.userId.toString() !== userId) {
      throw new AuthorizationError('You can only edit your own posts');
    }

    const updated = await postRepository.update(postId, updateData);
    if (!updated) throw new NotFoundError('Post not found');

    // Update cache
    await redis.setex(`post:${postId}`, this.CACHE_TTL, JSON.stringify(updated));

    // Emit event
    await EventBus.publish(EventTopic.COMMUNITY_POST_UPDATED, {
      postId: updated._id,
      updates: updateData,
    });

    return updated;
  }

  static async deletePost(postId: string, userId: string) {
    const post = await this.getPostById(postId);
    
    if (post.author.userId.toString() !== userId) {
      throw new AuthorizationError('You can only delete your own posts');
    }

    // Soft delete
    const deleted = await postRepository.update(postId, { deletedAt: new Date() });
    
    // Invalidate cache
    await redis.del(`post:${postId}`);

    // Emit event
    await EventBus.publish(EventTopic.COMMUNITY_POST_DELETED, {
      postId,
      authorId: userId,
    });

    return deleted;
  }
}
