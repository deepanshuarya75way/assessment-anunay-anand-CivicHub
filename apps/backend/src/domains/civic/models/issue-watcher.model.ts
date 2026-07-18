import mongoose, { Schema, Document } from 'mongoose';
import { IssueWatcher } from '@civichub/shared';

export interface IIssueWatcherDocument extends Omit<IssueWatcher, 'id'>, Document {
  id: string;
}

const IssueWatcherSchema = new Schema<IIssueWatcherDocument>(
  {
    issueId: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

IssueWatcherSchema.index({ issueId: 1, userId: 1 }, { unique: true });
IssueWatcherSchema.index({ userId: 1 });

export const IssueWatcherModel = mongoose.model<IIssueWatcherDocument>('IssueWatcher', IssueWatcherSchema);
