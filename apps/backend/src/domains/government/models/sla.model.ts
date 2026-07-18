import mongoose, { Schema } from 'mongoose';
import { SLAPolicy } from '@civichub/shared';

export type ISLAPolicyDocument = Omit<SLAPolicy, 'id'> & { _id: mongoose.Types.ObjectId };

const SLAPolicySchema = new Schema<ISLAPolicyDocument>({
  tenantId: { type: String, required: true },
  department: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: String, enum: ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'], required: true },
  targetResponseHours: { type: Number, required: true },
  targetResolutionHours: { type: Number, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

SLAPolicySchema.index({ department: 1, category: 1, priority: 1 });

export const SLAPolicyModel = mongoose.model<ISLAPolicyDocument>('SLAPolicy', SLAPolicySchema);
