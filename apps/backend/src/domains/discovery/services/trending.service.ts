import { PostModel } from '../../community/posts/post.model';
import { CommunityModel } from '../../communities/models/community.model';

export class TrendingService {
  static async getTrendingPosts(limit: number = 5) {
    // A proper time-decay trending algorithm would look at (reactions + comments) / (time_since_published)^gravity
    // For MVP, we'll simulate this by grabbing recent posts and sorting by engagement (requires an engagement score or just simple sort)
    // Here we just fetch recent posts as a placeholder for the algorithm.
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // In reality, you'd aggregate the total reactions and comments from other collections,
    // or rely on a denormalized `engagementScore` field that is updated via events.
    return PostModel.find({ createdAt: { $gte: threeDaysAgo }, deletedAt: null })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  static async getTrendingCommunities(limit: number = 5) {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return CommunityModel.find({ visibility: 'PUBLIC', lastActivityAt: { $gte: threeDaysAgo } })
      .sort({ postCount: -1, memberCount: -1 })
      .limit(limit);
  }
}
