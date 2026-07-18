import mongoose, { Schema, Document } from 'mongoose';
import { AIRequestLog } from '@civichub/shared';

export type IAIRequestLogDocument = Omit<AIRequestLog, 'id'> & { _id: mongoose.Types.ObjectId };

const AIRequestLogSchema = new Schema<IAIRequestLogDocument>({
  provider: { type: String, required: true },
  model: { type: String, required: true },
  latencyMs: { type: Number, required: true },
  tokens: { type: Number },
  estimatedCost: { type: Number },
  status: { type: String, enum: ['SUCCESS', 'ERROR', 'TIMEOUT'], required: true },
  feature: { type: String, required: true },
  cacheHit: { type: Boolean, default: false },
  retryCount: { type: Number, default: 0 },
  promptVersion: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const AIRequestLogModel = mongoose.model<IAIRequestLogDocument>('AIRequestLog', AIRequestLogSchema);
