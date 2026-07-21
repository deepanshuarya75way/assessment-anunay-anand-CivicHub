import mongoose, { Schema, Document } from 'mongoose';
import { ICommunity, CommunityVisibility } from '@civichub/shared';

export interface ICommunityDocument extends Omit<ICommunity, 'id'>, Document {}

const CommunitySchema = new Schema<ICommunityDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, maxlength: 500 },
    avatarUrl: { type: String, required: false },
    coverUrl: { type: String, required: false },
    rules: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    visibility: { type: String, enum: Object.values(CommunityVisibility), default: CommunityVisibility.PUBLIC },
    categories: { type: [String], default: [] },
    memberCount: { type: Number, default: 1 }, // Creator is a member
    postCount: { type: Number, default: 0 },
    lastActivityAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    creatorId: { type: String, required: true },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true, transform: (doc, ret: any) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } },
    toObject: { virtuals: true, transform: (doc, ret: any) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } }
  }
);

CommunitySchema.index({ slug: 1 });
CommunitySchema.index({ tags: 1 });
CommunitySchema.index({ categories: 1 });

export const CommunityModel = mongoose.model<ICommunityDocument>('Community', CommunitySchema);
