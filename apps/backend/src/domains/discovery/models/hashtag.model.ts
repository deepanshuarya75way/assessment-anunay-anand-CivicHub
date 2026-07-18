import mongoose, { Schema, Document } from 'mongoose';
import { IHashtag } from '@civichub/shared';

export interface IHashtagDocument extends IHashtag, Document {
  id: string; // Mongoose alias
}

const HashtagSchema = new Schema<IHashtagDocument>(
  {
    tag: { type: String, required: true, unique: true, lowercase: true, trim: true },
    usageCount: { type: Number, default: 1 },
    trendingScore: { type: Number, default: 0 },
    postCount: { type: Number, default: 1 },
    firstSeenAt: { type: Date, default: Date.now },
    lastUsedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

HashtagSchema.index({ tag: 'text' });
HashtagSchema.index({ trendingScore: -1 });
HashtagSchema.index({ usageCount: -1 });

export const HashtagModel = mongoose.model<IHashtagDocument>('Hashtag', HashtagSchema);
