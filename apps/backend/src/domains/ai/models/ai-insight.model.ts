import mongoose, { Schema, Document } from 'mongoose';
import { AIInsight } from '@civichub/shared';

export type IAIInsightDocument = Omit<AIInsight, 'id'> & { _id: mongoose.Types.ObjectId };

const AIInsightSchema = new Schema<IAIInsightDocument>({
  resourceType: { type: String, enum: ['ISSUE', 'COMMENT', 'CAMPAIGN', 'EVENT'], required: true },
  resourceId: { type: String, required: true },
  capability: { type: String, enum: ['CLASSIFICATION', 'DUPLICATE_DETECTION', 'ROUTING', 'SUMMARIZATION', 'MODERATION', 'TRANSLATION'], required: true },
  provider: { type: String, required: true },
  model: { type: String, required: true },
  confidence: { type: Number, required: true, min: 0, max: 100 },
  result: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
  acceptedBy: { type: String },
  acceptedAt: { type: Date }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

AIInsightSchema.index({ resourceType: 1, resourceId: 1, capability: 1 });

export const AIInsightModel = mongoose.model<IAIInsightDocument>('AIInsight', AIInsightSchema);
