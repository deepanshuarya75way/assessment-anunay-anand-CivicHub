import mongoose, { Schema } from 'mongoose';
import { AuditLog } from '@civichub/shared';

export type IAuditLogDocument = Omit<AuditLog, 'id'> & { _id: mongoose.Types.ObjectId };

const AuditLogSchema = new Schema<IAuditLogDocument>({
  actorId: { type: String, required: true },
  actorRole: { type: String, required: true },
  action: { type: String, required: true },
  resourceType: { type: String, required: true },
  resourceId: { type: String, required: true },
  changes: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  device: { type: String },
  createdAt: { type: Date, default: Date.now }
});

AuditLogSchema.index({ resourceType: 1, resourceId: 1 });
AuditLogSchema.index({ actorId: 1 });
AuditLogSchema.index({ createdAt: -1 });

export const AuditLogModel = mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);
