import mongoose, { Schema, Document } from 'mongoose';

export interface ISessionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  deviceId?: string;
  userAgent?: string;
  ipAddress?: string;
  refreshTokenFamilyId: string; // Used to invalidate an entire family of tokens if reuse is detected
  isValid: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISessionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deviceId: { type: String, required: false },
    userAgent: { type: String, required: false },
    ipAddress: { type: String, required: false },
    refreshTokenFamilyId: { type: String, required: true, index: true },
    isValid: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Index for auto-expiration (TTL index)
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
SessionSchema.index({ userId: 1 });

export const SessionModel = mongoose.model<ISessionDocument>('Session', SessionSchema);
