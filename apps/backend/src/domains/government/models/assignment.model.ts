import mongoose, { Schema } from 'mongoose';
import { Assignment } from '@civichub/shared';

export type IAssignmentDocument = Omit<Assignment, 'id'> & { _id: mongoose.Types.ObjectId };

const AssignmentSchema = new Schema<IAssignmentDocument>({
  issueId: { type: String, required: true },
  officerId: { type: String, required: true },
  assignedBy: { type: String, required: true },
  assignedAt: { type: Date, required: true },
  acceptedAt: { type: Date },
  completedAt: { type: Date },
  status: { type: String, enum: ['PENDING_ACCEPTANCE', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'TRANSFERRED'], required: true },
  priority: { type: String, enum: ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'], required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

AssignmentSchema.index({ issueId: 1 });
AssignmentSchema.index({ officerId: 1 });

export const AssignmentModel = mongoose.model<IAssignmentDocument>('Assignment', AssignmentSchema);
