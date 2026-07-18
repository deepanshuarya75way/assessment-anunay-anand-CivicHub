import { postRepository } from '../posts/post.repository';

export class FeedService {
  static async getChronologicalFeed(limit: number = 20, cursor?: Date, spaceType?: string, spaceId?: string) {
    const query: any = {};
    if (spaceType) {
      query['belongsTo.type'] = spaceType;
      if (spaceId) {
        query['belongsTo.id'] = spaceId;
      }
    }

    const posts = await postRepository.findWithCursor(query, limit + 1, cursor);
    
    let hasNextPage = false;
    let nextCursor = null;

    if (posts.length > limit) {
      hasNextPage = true;
      posts.pop(); // Remove the extra item
      nextCursor = posts[posts.length - 1].createdAt;
    }

    return {
      posts,
      pageInfo: {
        hasNextPage,
        nextCursor,
      },
    };
  }
}
