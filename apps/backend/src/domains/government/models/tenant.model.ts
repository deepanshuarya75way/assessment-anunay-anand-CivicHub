import mongoose, { Schema } from 'mongoose';
import { Tenant } from '@civichub/shared';

export type ITenantDocument = Omit<Tenant, 'id'> & { _id: mongoose.Types.ObjectId };

const TenantSchema = new Schema<ITenantDocument>({
  name: { type: String, required: true },
  region: { type: String, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const TenantModel = mongoose.model<ITenantDocument>('Tenant', TenantSchema);
