import mongoose, { Schema, Document } from 'mongoose';
import { Campaign, SpaceReference } from '@civichub/shared';

export interface ICampaignDocument extends Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>, Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

const SpaceReferenceSchema = new Schema<SpaceReference>({
  type: {
    type: String,
    enum: ['global', 'community', 'organization'],
    required: true,
  },
  id: { type: String },
}, { _id: false });

const CampaignSchema = new Schema<ICampaignDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    objectives: { type: [String], default: [] },
    organizerId: { type: String, required: true },
    space: { type: SpaceReferenceSchema, required: true },
    relatedIssues: { type: [String], default: [] },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'REGISTRATION_OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ARCHIVED'],
      default: 'DRAFT',
      required: true
    },
  },
  { timestamps: true }
);

// Indexes
CampaignSchema.index({ organizerId: 1 });
CampaignSchema.index({ 'space.type': 1, 'space.id': 1 });
CampaignSchema.index({ status: 1 });
CampaignSchema.index({ startDate: 1, endDate: 1 });

export const CampaignModel = mongoose.model<ICampaignDocument>('Campaign', CampaignSchema);
