import mongoose, { Schema } from 'mongoose';
import { Inspection } from '@civichub/shared';

export type IInspectionDocument = Omit<Inspection, 'id'> & { _id: mongoose.Types.ObjectId };

const InspectionSchema = new Schema<IInspectionDocument>({
  issueId: { type: String, required: true },
  officerId: { type: String, required: true },
  scheduledTime: { type: Date, required: true },
  completedTime: { type: Date },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] } // [longitude, latitude]
  },
  weatherConditions: { type: String },
  checklist: [{
    task: { type: String, required: true },
    completed: { type: Boolean, required: true, default: false }
  }],
  findings: { type: String },
  recommendations: { type: String },
  mediaIds: { type: [String], default: [] },
  followUpRequired: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

InspectionSchema.index({ issueId: 1 });
InspectionSchema.index({ officerId: 1 });
InspectionSchema.index({ location: '2dsphere' });

export const InspectionModel = mongoose.model<IInspectionDocument>('Inspection', InspectionSchema);
