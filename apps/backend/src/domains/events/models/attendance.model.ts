import mongoose, { Schema, Document } from 'mongoose';
import { Attendance, EventCompletion } from '@civichub/shared';

export interface IAttendanceDocument extends Omit<Attendance, 'id'>, Document {
  id: string;
}

const EventCompletionSchema = new Schema<EventCompletion>({
  approvedBy: { type: String, required: true },
  approvedAt: { type: Date, required: true },
  eligibleForCertificate: { type: Boolean, default: false },
}, { _id: false });

const AttendanceSchema = new Schema<IAttendanceDocument>(
  {
    eventId: { type: String, required: true },
    userId: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['REGISTERED', 'WAITLISTED', 'CHECKED_IN', 'ATTENDED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
      default: 'REGISTERED' 
    },
    registeredAt: { type: Date, default: Date.now },
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    hoursEarned: { type: Number },
    checkedInBy: { type: String },
    checkedOutBy: { type: String },
    checkInMethod: { type: String },
    deviceInfo: { type: String },
    verificationSource: { type: String },
    completion: { type: EventCompletionSchema },
  },
  { timestamps: true }
);

// Indexes
AttendanceSchema.index({ eventId: 1, userId: 1 }, { unique: true }); // Prevent duplicate registrations
AttendanceSchema.index({ eventId: 1, status: 1 });
AttendanceSchema.index({ userId: 1 });

export const AttendanceModel = mongoose.model<IAttendanceDocument>('Attendance', AttendanceSchema);
