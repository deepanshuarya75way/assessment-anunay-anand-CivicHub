import mongoose, { Schema, Document } from 'mongoose';
import { VolunteerProfile } from '@civichub/shared';

export interface IVolunteerProfileDocument extends Omit<VolunteerProfile, 'id' | 'createdAt' | 'updatedAt'>, Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

const VolunteerProfileSchema = new Schema<IVolunteerProfileDocument>(
  {
    userId: { type: String, required: true, unique: true },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    availability: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    experience: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
VolunteerProfileSchema.index({ userId: 1 });
VolunteerProfileSchema.index({ skills: 1 });
VolunteerProfileSchema.index({ isVerified: 1 });

export const VolunteerProfileModel = mongoose.model<IVolunteerProfileDocument>('VolunteerProfile', VolunteerProfileSchema);
