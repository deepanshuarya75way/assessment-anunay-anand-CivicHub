import mongoose, { Schema, Document } from 'mongoose';

export enum Visibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  FOLLOWERS = 'FOLLOWERS',
}

export enum AttachmentType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
}

export enum SpaceType {
  GLOBAL = 'GLOBAL',
  COMMUNITY = 'COMMUNITY',
  ORGANIZATION = 'ORGANIZATION',
}

// Value Objects Definitions
const AuthorSnapshotSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatarUrl: { type: String, required: false },
}, { _id: false });

const AttachmentSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, enum: Object.values(AttachmentType), required: true },
  url: { type: String, required: true },
  thumbnailUrl: { type: String, required: false },
  width: { type: Number, required: false },
  height: { type: Number, required: false },
  size: { type: Number, required: false },
}, { _id: false });

const ContentSchema = new Schema({
  text: { type: String, required: true },
  categories: [{ type: String }],
  hashtags: [{ type: String }],
  mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { _id: false });

const SpaceReferenceSchema = new Schema({
  type: { type: String, enum: Object.values(SpaceType), default: SpaceType.GLOBAL },
  id: { type: Schema.Types.ObjectId, required: false },
}, { _id: false });

export interface IPostDocument extends Document {
  author: {
    userId: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  content: {
    text: string;
    categories: string[];
    hashtags: string[];
    mentions: mongoose.Types.ObjectId[];
  };
  attachments: {
    id: string;
    type: AttachmentType;
    url: string;
    thumbnailUrl?: string;
    width?: number;
    height?: number;
    size?: number;
  }[];
  belongsTo: {
    type: SpaceType;
    id?: mongoose.Types.ObjectId;
  };
  visibility: Visibility;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPostDocument>({
  author: { type: AuthorSnapshotSchema, required: true },
  content: { type: ContentSchema, required: true },
  attachments: { type: [AttachmentSchema], default: [] },
  belongsTo: { type: SpaceReferenceSchema, default: () => ({ type: SpaceType.GLOBAL }) },
  visibility: { type: String, enum: Object.values(Visibility), default: Visibility.PUBLIC },
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

// Indexes for fast querying, especially for Feed
PostSchema.index({ 'author.userId': 1, createdAt: -1 });
PostSchema.index({ createdAt: -1 }); // Global chronological feed
PostSchema.index({ 'belongsTo.type': 1, 'belongsTo.id': 1, createdAt: -1 }); // Space specific feed
PostSchema.index({ deletedAt: 1 });

export const PostModel = mongoose.model<IPostDocument>('Post', PostSchema);
