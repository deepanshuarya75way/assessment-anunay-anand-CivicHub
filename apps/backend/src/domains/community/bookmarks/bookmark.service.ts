import { BookmarkModel } from './bookmark.model';
import { EventBus } from '../../../core/events/event.bus';
import { EventTopic } from '../../../core/events/event.types';
import { PostModel } from '../posts/post.model';

export class BookmarkService {
  static async toggleBookmark(postId: string, userId: string) {
    const existing = await BookmarkModel.findOne({ postId, userId });
    
    if (existing) {
      await existing.deleteOne();
      // Optional event
      return { status: 'removed' };
    }

    const bookmark = await BookmarkModel.create({ postId, userId });
    await EventBus.publish(EventTopic.COMMUNITY_BOOKMARK_CREATED, bookmark);
    
    return { status: 'added', bookmark };
  }

  static async getBookmarksForUser(userId: string, limit: number = 20, cursor?: Date) {
    const query: any = { userId };
    if (cursor) {
      query.createdAt = { $lt: cursor };
    }

    const bookmarks = await BookmarkModel.find(query).sort({ createdAt: -1 }).limit(limit + 1);
    
    let hasNextPage = false;
    let nextCursor = null;

    if (bookmarks.length > limit) {
      hasNextPage = true;
      bookmarks.pop();
      nextCursor = bookmarks[bookmarks.length - 1].createdAt;
    }

    // Populate posts manually if we want to use the PostRepository logic (like soft-delete checks)
    const postIds = bookmarks.map(b => b.postId);
    const posts = await PostModel.find({ _id: { $in: postIds }, deletedAt: null });

    // Map back to preserve order
    const orderedPosts = bookmarks
      .map(b => posts.find(p => p._id.toString() === b.postId.toString()))
      .filter(p => !!p);

    return { posts: orderedPosts, pageInfo: { hasNextPage, nextCursor } };
  }
}
