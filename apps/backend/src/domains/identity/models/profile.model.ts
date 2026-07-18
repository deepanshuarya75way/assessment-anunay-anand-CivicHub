import mongoose, { Schema, Document } from 'mongoose';
import { IProfile } from '@civichub/shared';

export interface IProfileDocument extends Omit<IProfile, 'id' | 'userId'>, Document {
  userId: mongoose.Types.ObjectId;
}

const ProfileSchema = new Schema<IProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    bio: { type: String, maxlength: 500 },
    avatarUrl: { type: String },
    coverUrl: { type: String },
    location: { type: String, maxlength: 100 },
    website: { type: String },
    socialLinks: { type: Map, of: String, default: {} },
    privacy: {
      profileVisibility: { type: String, enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC' },
      showActivity: { type: Boolean, default: true },
      showBookmarks: { type: Boolean, default: false },
      showCommunities: { type: Boolean, default: true },
      allowMentions: { type: Boolean, default: true },
      allowMessages: { type: Boolean, default: true },
    },
    reputation: {
      score: { type: Number, default: 0 },
      level: { type: String, default: 'Newcomer' },
      contributions: { type: Number, default: 0 },
      posts: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      helpfulVotes: { type: Number, default: 0 },
      civicPoints: { type: Number, default: 0 },
      volunteerPoints: { type: Number, default: 0 },
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } },
    toObject: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } }
  }
);

export const ProfileModel = mongoose.model<IProfileDocument>('Profile', ProfileSchema);
