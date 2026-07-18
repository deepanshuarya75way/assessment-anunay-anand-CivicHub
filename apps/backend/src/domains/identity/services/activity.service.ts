import { ProfileService } from './profile.service';
import mongoose from 'mongoose';

// Assuming we have models for Post, Comment, Reaction, Bookmark in community domain
// Here we will use mongoose to query those collections directly for aggregation
// In a fully decoupled architecture, we would use an event-sourced read model or inter-domain calls.
// For simplicity and per instructions, we query the collections.

export class ActivityService {
  static async getUserActivity(username: string) {
    const profile = await ProfileService.getProfileByUsername(username);
    const userId = profile.userId._id || profile.userId;

    // Fetch posts
    const posts = await mongoose.connection.db!.collection('posts')
      .find({ authorId: new mongoose.Types.ObjectId(userId.toString()) })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    // Fetch comments
    const comments = await mongoose.connection.db!.collection('comments')
      .find({ authorId: new mongoose.Types.ObjectId(userId.toString()) })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();
      
    // Fetch bookmarks (if public/authorized)
    // Fetch reactions (if public)

    // Aggregate into a timeline
    const activity = [
      ...posts.map(p => ({ type: 'POST', data: p, createdAt: p.createdAt })),
      ...comments.map(c => ({ type: 'COMMENT', data: c, createdAt: c.createdAt }))
    ];

    activity.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return activity.slice(0, 20);
  }
}
