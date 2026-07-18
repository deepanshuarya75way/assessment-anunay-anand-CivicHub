import mongoose, { Schema, Document } from 'mongoose';

export enum ReactionType {
  LIKE = 'LIKE',
  APPRECIATE = 'APPRECIATE',
  CELEBRATE = 'CELEBRATE',
  INSIGHTFUL = 'INSIGHTFUL',
}

export interface IReactionDocument extends Document {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: ReactionType;
  createdAt: Date;
  updatedAt: Date;
}

const ReactionSchema = new Schema<IReactionDocument>({
  postId: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  type: { type: String, enum: Object.values(ReactionType), required: true },
}, { timestamps: true });

// Compound index to ensure only one active reaction per user per post
ReactionSchema.index({ postId: 1, userId: 1 }, { unique: true });

export const ReactionModel = mongoose.model<IReactionDocument>('Reaction', ReactionSchema);
