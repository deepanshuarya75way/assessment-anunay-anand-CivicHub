import mongoose, { Schema, Document } from 'mongoose';
import { IssueSupport } from '@civichub/shared';

export interface IIssueSupportDocument extends Omit<IssueSupport, 'id'>, Document {
  id: string;
}

const IssueSupportSchema = new Schema<IIssueSupportDocument>(
  {
    issueId: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

IssueSupportSchema.index({ issueId: 1, userId: 1 }, { unique: true });
IssueSupportSchema.index({ userId: 1 });

export const IssueSupportModel = mongoose.model<IIssueSupportDocument>('IssueSupport', IssueSupportSchema);
