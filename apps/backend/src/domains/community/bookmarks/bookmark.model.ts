import mongoose, { Schema, Document } from 'mongoose';

export interface IBookmarkDocument extends Document {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmarkDocument>({
  postId: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: { createdAt: true, updatedAt: false } });

// Compound index to ensure only one bookmark per user per post
BookmarkSchema.index({ postId: 1, userId: 1 }, { unique: true });
BookmarkSchema.index({ userId: 1, createdAt: -1 }); // Fast lookup for user's bookmarks

export const BookmarkModel = mongoose.model<IBookmarkDocument>('Bookmark', BookmarkSchema);
