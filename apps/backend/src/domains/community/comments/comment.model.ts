import mongoose, { Schema, Document } from 'mongoose';

const AuthorSnapshotSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatarUrl: { type: String, required: false },
}, { _id: false });

const ContentSchema = new Schema({
  text: { type: String, required: true },
  mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { _id: false });

export enum CommentStatus {
  ACTIVE = 'ACTIVE',
  FLAGGED = 'FLAGGED',
  HIDDEN = 'HIDDEN',
}

export interface ICommentDocument extends Document {
  targetId: mongoose.Types.ObjectId;
  targetType: string;
  parentId?: mongoose.Types.ObjectId; // For nested replies
  author: {
    userId: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  content: {
    text: string;
    mentions: mongoose.Types.ObjectId[];
  };
  isEdited: boolean;
  editedAt?: Date;
  status: CommentStatus;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  isOfficial?: boolean;
  organizationId?: mongoose.Types.ObjectId;
}

const CommentSchema = new Schema<ICommentDocument>({
  targetId: { type: Schema.Types.ObjectId, required: true },
  targetType: { type: String, required: true, enum: ['post', 'issue'] },
  parentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
  author: { type: AuthorSnapshotSchema, required: true },
  content: { type: ContentSchema, required: true },
  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date },
  status: { type: String, enum: Object.values(CommentStatus), default: CommentStatus.ACTIVE },
  deletedAt: { type: Date, default: null },
  isOfficial: { type: Boolean, default: false },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
}, { timestamps: true });

// Indexes for fast lookup
CommentSchema.index({ targetId: 1, targetType: 1, createdAt: 1 });
CommentSchema.index({ parentId: 1, createdAt: 1 }); // For loading replies

export const CommentModel = mongoose.model<ICommentDocument>('Comment', CommentSchema);
