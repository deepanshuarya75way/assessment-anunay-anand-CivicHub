import mongoose, { Schema, Document } from 'mongoose';
import { DuplicateIssue } from '@civichub/shared';

export interface IDuplicateIssueDocument extends Omit<DuplicateIssue, 'id'>, Document {
  id: string;
}

const DuplicateIssueSchema = new Schema<IDuplicateIssueDocument>(
  {
    duplicateId: { type: String, required: true },
    primaryId: { type: String, required: true },
    reason: { type: String },
    mergedAt: { type: Date, default: Date.now },
    mergedBy: { type: String, required: true }, // userId of moderator
  },
  { timestamps: true }
);

DuplicateIssueSchema.index({ duplicateId: 1 }, { unique: true }); // An issue can only be a duplicate of one primary
DuplicateIssueSchema.index({ primaryId: 1 });

export const DuplicateIssueModel = mongoose.model<IDuplicateIssueDocument>('DuplicateIssue', DuplicateIssueSchema);
