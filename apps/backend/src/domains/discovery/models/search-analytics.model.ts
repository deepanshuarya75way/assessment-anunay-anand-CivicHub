import mongoose, { Schema, Document } from 'mongoose';
import { ISearchAnalytics } from '@civichub/shared';

export interface ISearchAnalyticsDocument extends ISearchAnalytics, Document {
  id: string;
}

const SearchAnalyticsSchema = new Schema<ISearchAnalyticsDocument>(
  {
    term: { type: String, required: true },
    typeSelected: { type: String, required: false },
    clickedUrl: { type: String, required: false },
    userId: { type: String, required: false }, // Optional, for unauthenticated searches
    timestamp: { type: Date, default: Date.now },
  }
);

SearchAnalyticsSchema.index({ timestamp: -1 });
SearchAnalyticsSchema.index({ term: 1 });

export const SearchAnalyticsModel = mongoose.model<ISearchAnalyticsDocument>('SearchAnalytics', SearchAnalyticsSchema);
