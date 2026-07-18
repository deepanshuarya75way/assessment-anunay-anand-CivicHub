import mongoose, { Schema, Document } from 'mongoose';
import { VolunteerHour } from '@civichub/shared';

export interface IVolunteerHourDocument extends Omit<VolunteerHour, 'id' | 'createdAt'>, Document {
  id: string;
  createdAt: Date;
}

const VolunteerHourSchema = new Schema<IVolunteerHourDocument>(
  {
    userId: { type: String, required: true },
    campaignId: { type: String },
    taskId: { type: String },
    hours: { type: Number, required: true, min: 0.5 },
    approvedBy: { type: String },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes
VolunteerHourSchema.index({ userId: 1 });
VolunteerHourSchema.index({ campaignId: 1 });
VolunteerHourSchema.index({ taskId: 1 });

export const VolunteerHourModel = mongoose.model<IVolunteerHourDocument>('VolunteerHour', VolunteerHourSchema);
