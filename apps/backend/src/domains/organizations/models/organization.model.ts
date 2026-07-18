import mongoose, { Schema, Document } from 'mongoose';
import { IOrganization, OrganizationType, OrganizationVerificationStatus } from '@civichub/shared';

export interface IOrganizationDocument extends Omit<IOrganization, 'id'>, Document {}

const OrganizationSchema = new Schema<IOrganizationDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, maxlength: 500 },
    type: { type: String, enum: Object.values(OrganizationType), required: true },
    verificationStatus: { type: String, enum: Object.values(OrganizationVerificationStatus), default: OrganizationVerificationStatus.PENDING },
    contactInfo: {
      email: { type: String, required: true },
      phone: { type: String },
      website: { type: String },
      address: { type: String },
    },
    avatarUrl: { type: String },
    coverUrl: { type: String },
    officialBadge: { type: String },
    memberCount: { type: Number, default: 1 },
    postCount: { type: Number, default: 0 },
    lastActivityAt: { type: Date, default: Date.now },
    creatorId: { type: String, required: true },
  },
  { timestamps: true }
);

OrganizationSchema.index({ slug: 1 });
OrganizationSchema.index({ type: 1 });

export const OrganizationModel = mongoose.model<IOrganizationDocument>('Organization', OrganizationSchema);
