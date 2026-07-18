import mongoose, { Schema, Document } from 'mongoose';
import { IOrganizationMember, OrganizationRole } from '@civichub/shared';

export interface IOrganizationMemberDocument extends Omit<IOrganizationMember, 'id'>, Document {}

const OrganizationMemberSchema = new Schema<IOrganizationMemberDocument>(
  {
    organizationId: { type: String, required: true },
    userId: { type: String, required: true },
    role: { type: String, enum: Object.values(OrganizationRole), default: OrganizationRole.VOLUNTEER },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

OrganizationMemberSchema.index({ organizationId: 1, userId: 1 }, { unique: true });
OrganizationMemberSchema.index({ userId: 1 });

export const OrganizationMemberModel = mongoose.model<IOrganizationMemberDocument>('OrganizationMember', OrganizationMemberSchema);
