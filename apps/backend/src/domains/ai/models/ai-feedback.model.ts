import mongoose, { Schema, Document } from 'mongoose';
import { AIFeedback } from '@civichub/shared';

export interface IAIFeedbackDocument extends Omit<AIFeedback, 'id'>, Document {}

const AIFeedbackSchema = new Schema<IAIFeedbackDocument>({
  insightId: { type: String, required: true },
  userAction: { type: String, enum: ['ACCEPTED', 'MODIFIED', 'REJECTED', 'IGNORED'], required: true },
  originalResult: { type: Schema.Types.Mixed, required: true },
  modifiedResult: { type: Schema.Types.Mixed },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const AIFeedbackModel = mongoose.model<IAIFeedbackDocument>('AIFeedback', AIFeedbackSchema);
