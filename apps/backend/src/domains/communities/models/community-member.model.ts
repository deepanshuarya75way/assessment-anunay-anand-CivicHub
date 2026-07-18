import mongoose, { Schema, Document } from 'mongoose';
import { ICommunityMember, CommunityRole, CommunityMemberStatus } from '@civichub/shared';

export interface ICommunityMemberDocument extends Omit<ICommunityMember, 'id'>, Document {}

const CommunityMemberSchema = new Schema<ICommunityMemberDocument>(
  {
    communityId: { type: String, required: true },
    userId: { type: String, required: true },
    role: { type: String, enum: Object.values(CommunityRole), default: CommunityRole.MEMBER },
    status: { type: String, enum: Object.values(CommunityMemberStatus), default: CommunityMemberStatus.APPROVED },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

CommunityMemberSchema.index({ communityId: 1, userId: 1 }, { unique: true });
CommunityMemberSchema.index({ userId: 1 });

export const CommunityMemberModel = mongoose.model<ICommunityMemberDocument>('CommunityMember', CommunityMemberSchema);
