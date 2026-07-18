import { HashtagModel } from '../models/hashtag.model';
import { NotFoundError } from '../../../core/exceptions';

export class HashtagService {
  static async getHashtag(tag: string) {
    const hashtag = await HashtagModel.findOne({ tag: tag.toLowerCase() });
    if (!hashtag) throw new NotFoundError('Hashtag not found');
    return hashtag;
  }

  static async getPopularHashtags(limit: number = 10) {
    return HashtagModel.find()
      .sort({ trendingScore: -1, usageCount: -1 })
      .limit(limit);
  }

  static async recordUsage(tag: string) {
    const lowerTag = tag.toLowerCase();
    
    // Time-decay bump for trending score (simple implementation: +1 to usage, +10 to trending score, 
    // we would use a cron job to decay the score daily)
    await HashtagModel.findOneAndUpdate(
      { tag: lowerTag },
      { 
        $inc: { usageCount: 1, trendingScore: 10, postCount: 1 },
        $set: { lastUsedAt: new Date() },
        $setOnInsert: { firstSeenAt: new Date() }
      },
      { upsert: true }
    );
  }
}
