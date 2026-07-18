import { commentRepository } from './comment.repository';
import { ICommentDocument } from './comment.model';
import { EventBus } from '../../../core/events/event.bus';
import { EventTopic } from '../../../core/events/event.types';
import { NotFoundError, AuthorizationError } from '../../../core/exceptions';
import { ContentParser } from '../shared/content-parser';
import { ModerationService } from '../moderation/moderation.service';
import { redis } from '../../../core/config/redis';

export class CommentService {
  static async createComment(data: Partial<ICommentDocument>) {
    const isApproved = await ModerationService.checkContent(data.content!.text);
    if (!isApproved) {
      throw new Error('Content flagged by moderation');
    }

    // Parse Mentions
    const mentions = ContentParser.parseMentions(data.content!.text);
    // Real implementation would look up user IDs based on mention handles here.
    // For now we just keep the array empty or let the controller handle it.
    
    const comment = await commentRepository.create(data);

    // Emit event
    const topic = comment.parentId ? EventTopic.COMMUNITY_REPLY_CREATED : EventTopic.COMMUNITY_COMMENT_CREATED;
    await EventBus.publish(topic, comment);

    // Update count in redis
    await redis.incr(`${comment.targetType}:${comment.targetId}:comments_count`);

    return comment;
  }

  static async getCommentsForTarget(targetId: string, targetType: string, limit: number = 20, cursor?: Date) {
    const comments = await commentRepository.findByTarget(targetId, targetType, limit + 1, cursor);
    
    let hasNextPage = false;
    let nextCursor = null;

    if (comments.length > limit) {
      hasNextPage = true;
      comments.pop();
      nextCursor = comments[comments.length - 1].createdAt;
    }

    return { comments, pageInfo: { hasNextPage, nextCursor } };
  }

  static async getRepliesForComment(parentId: string, limit: number = 20, cursor?: Date) {
    const replies = await commentRepository.findReplies(parentId, limit + 1, cursor);
    
    let hasNextPage = false;
    let nextCursor = null;

    if (replies.length > limit) {
      hasNextPage = true;
      replies.pop();
      nextCursor = replies[replies.length - 1].createdAt;
    }

    return { replies, pageInfo: { hasNextPage, nextCursor } };
  }

  static async updateComment(commentId: string, userId: string, text: string) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) throw new NotFoundError('Comment not found');
    if (comment.author.userId.toString() !== userId) {
      throw new AuthorizationError('You can only edit your own comments');
    }

    comment.content.text = text;
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    await EventBus.publish(EventTopic.COMMUNITY_COMMENT_UPDATED, comment);

    return comment;
  }

  static async deleteComment(commentId: string, userId: string) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) throw new NotFoundError('Comment not found');
    if (comment.author.userId.toString() !== userId) {
      throw new AuthorizationError('You can only delete your own comments');
    }

    comment.deletedAt = new Date();
    await comment.save();

    await EventBus.publish(EventTopic.COMMUNITY_COMMENT_DELETED, { commentId, targetId: comment.targetId, targetType: comment.targetType });
    
    await redis.decr(`${comment.targetType}:${comment.targetId}:comments_count`);

    return comment;
  }
}
