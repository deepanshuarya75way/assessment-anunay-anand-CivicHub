import mongoose, { Schema, Document } from 'mongoose';
import { Department } from '@civichub/shared';

export interface IDepartmentDocument extends Omit<Department, 'id'>, Document {
  id: string;
}

const DepartmentSchema = new Schema<IDepartmentDocument>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

DepartmentSchema.index({ name: 'text' });

export const DepartmentModel = mongoose.model<IDepartmentDocument>('Department', DepartmentSchema);
