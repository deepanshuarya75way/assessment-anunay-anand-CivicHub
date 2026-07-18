import mongoose, { Schema } from 'mongoose';
import { OfficerProfile } from '@civichub/shared';

export type IOfficerDocument = Omit<OfficerProfile, 'id'> & { _id: mongoose.Types.ObjectId };

const OfficerSchema = new Schema<IOfficerDocument>({
  userId: { type: String, required: true, unique: true },
  tenantId: { type: String, required: true },
  employeeId: { type: String, required: true },
  designation: { type: String, required: true },
  primaryDepartment: { type: String, required: true },
  secondaryDepartments: { type: [String], default: [] },
  supervisorId: { type: String },
  officeLocation: { type: String },
  contactInfo: { type: Schema.Types.Mixed },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const OfficerModel = mongoose.model<IOfficerDocument>('Officer', OfficerSchema);
