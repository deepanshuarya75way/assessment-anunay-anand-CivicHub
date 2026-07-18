import mongoose, { Schema, Document } from 'mongoose';
import { Event, ScheduleItem, Announcement } from '@civichub/shared';

export interface IEventDocument extends Omit<Event, 'id'>, Document {
  id: string;
}

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

const SpaceReferenceSchema = new Schema({
  type: { type: String, enum: ['global', 'community', 'organization'], required: true },
  id: { type: String }
}, { _id: false });

const ScheduleItemSchema = new Schema<ScheduleItem>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  speaker: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  location: { type: String },
}, { _id: false });

const AnnouncementSchema = new Schema<Announcement>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: { type: String, enum: ['NORMAL', 'IMPORTANT', 'EMERGENCY'], default: 'NORMAL' },
  postedBy: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
}, { _id: false });

const EventMediaSchema = new Schema({
  bannerId: { type: String },
  attachmentIds: { type: [String], default: [] },
}, { _id: false });

const EventSchema = new Schema<IEventDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    eventType: { type: String, required: true },
    space: { type: SpaceReferenceSchema, required: true },
    organizerId: { type: String, required: true },
    relatedCampaigns: { type: [String], default: [] },
    relatedIssues: { type: [String], default: [] },
    location: { type: GeoJSONPointSchema },
    address: { type: String },
    capacity: { type: Number },
    registrationLimit: { type: Number },
    visibility: { type: String, enum: ['PUBLIC', 'PRIVATE', 'COMMUNITY_ONLY'], default: 'PUBLIC' },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    media: { type: EventMediaSchema, default: () => ({ attachmentIds: [] }) },
    status: { 
      type: String, 
      enum: ['DRAFT', 'PUBLISHED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'LIVE', 'COMPLETED', 'ARCHIVED', 'CANCELLED'],
      default: 'DRAFT'
    },
    schedules: { type: [ScheduleItemSchema], default: [] },
    announcements: { type: [AnnouncementSchema], default: [] },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } },
    toObject: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } }
  }
);

// Indexes
EventSchema.index({ location: '2dsphere' });
EventSchema.index({ 'space.type': 1, 'space.id': 1 });
EventSchema.index({ organizerId: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ startTime: 1, endTime: 1 });

export const EventModel = mongoose.model<IEventDocument>('Event', EventSchema);
