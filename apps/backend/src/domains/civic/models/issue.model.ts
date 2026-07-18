import mongoose, { Schema, Document } from 'mongoose';
import { Issue, WorkflowHistory, Attachment, CitizenUpdate } from '@civichub/shared';

export interface IIssueDocument extends Omit<Issue, 'id'>, Document {
  id: string;
}

const WorkflowHistorySchema = new Schema<WorkflowHistory>({
  status: { type: String, required: true },
  changedBy: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String },
}, { _id: false });

const AttachmentSchema = new Schema<Attachment>({
  mediaId: { type: String, required: true },
  url: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
}, { _id: false });

const CitizenUpdateSchema = new Schema<CitizenUpdate>({
  text: { type: String, required: true },
  attachments: { type: [AttachmentSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const GeoJSONPointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
}, { _id: false });

const IssueSchema = new Schema<IIssueDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    categoryId: { type: String, required: true },
    reporterId: { type: String, required: true },
    assignedDepartmentId: { type: String },
    
    // Location
    location: { type: GeoJSONPointSchema, required: true },
    address: { type: String },

    // Workflow
    currentStatus: { 
      type: String, 
      required: true,
      enum: ['reported', 'verified', 'assigned', 'in_progress', 'resolved', 'closed'],
      default: 'reported'
    },
    workflowHistory: { type: [WorkflowHistorySchema], default: [] },
    
    // Updates
    citizenUpdates: { type: [CitizenUpdateSchema], default: [] },
    
    // Media
    attachments: { type: [AttachmentSchema], default: [] },

    // Context
    contextType: { 
      type: String, 
      required: true,
      enum: ['global', 'community', 'organization'],
      default: 'global'
    },
    contextId: { type: String },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } },
    toObject: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } }
  }
);

// Indexes
IssueSchema.index({ location: '2dsphere' });
IssueSchema.index({ categoryId: 1 });
IssueSchema.index({ assignedDepartmentId: 1 });
IssueSchema.index({ reporterId: 1 });
IssueSchema.index({ contextType: 1, contextId: 1 });
IssueSchema.index({ title: 'text', description: 'text' });
IssueSchema.index({ currentStatus: 1 });

export const IssueModel = mongoose.model<IIssueDocument>('Issue', IssueSchema);
