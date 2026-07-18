import mongoose, { Schema, Document } from 'mongoose';

export type IEmbeddingDocument = {
  _id: mongoose.Types.ObjectId;
  resourceType: string;
  resourceId: string;
  provider: string;
  model: string;
  vector: number[];
  createdAt: Date;
};

const EmbeddingSchema = new Schema<IEmbeddingDocument>({
  resourceType: { type: String, required: true },
  resourceId: { type: String, required: true },
  provider: { type: String, required: true },
  model: { type: String, required: true },
  vector: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now }
});

// Assuming Atlas Vector Search index is created separately, but we add a regular index for lookup
EmbeddingSchema.index({ resourceType: 1, resourceId: 1 }, { unique: true });

export const EmbeddingModel = mongoose.model<IEmbeddingDocument>('Embedding', EmbeddingSchema);
