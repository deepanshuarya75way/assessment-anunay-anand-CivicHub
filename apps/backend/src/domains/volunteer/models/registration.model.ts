import mongoose, { Schema, Document } from 'mongoose';
import { Registration } from '@civichub/shared';

export interface IRegistrationDocument extends Omit<Registration, 'id' | 'updatedAt'>, Document {
  id: string;
  updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistrationDocument>(
  {
    userId: { type: String, required: true },
    campaignId: { type: String, required: true },
    status: {
      type: String,
      enum: ['REGISTERED', 'CHECKED_IN', 'ACTIVE', 'COMPLETED', 'WITHDRAWN', 'REMOVED'],
      default: 'REGISTERED',
      required: true
    },
    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes
RegistrationSchema.index({ userId: 1 });
RegistrationSchema.index({ campaignId: 1 });
RegistrationSchema.index({ userId: 1, campaignId: 1 }, { unique: true }); // A user registers for a campaign once

export const RegistrationModel = mongoose.model<IRegistrationDocument>('VolunteerRegistration', RegistrationSchema);
