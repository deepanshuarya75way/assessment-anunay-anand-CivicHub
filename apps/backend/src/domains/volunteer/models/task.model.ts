import mongoose, { Schema, Document } from 'mongoose';
import { Task } from '@civichub/shared';

export interface ITaskDocument extends Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITaskDocument>(
  {
    campaignId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: { type: [String], default: [] },
    assignees: { type: [String], default: [] },
    maxVolunteers: { type: Number, default: 1, min: 1 },
    status: {
      type: String,
      enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'],
      default: 'TODO',
      required: true
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
      required: true
    },
    estimatedEffort: { type: Number },
    assignedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

// Indexes
TaskSchema.index({ campaignId: 1 });
TaskSchema.index({ assignees: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });

export const TaskModel = mongoose.model<ITaskDocument>('VolunteerTask', TaskSchema);
