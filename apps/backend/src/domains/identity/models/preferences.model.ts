import mongoose, { Schema, Document } from 'mongoose';
import { IPreferences } from '@civichub/shared';

export interface IPreferencesDocument extends Omit<IPreferences, 'id' | 'userId'>, Document {
  userId: mongoose.Types.ObjectId;
}

const PreferencesSchema = new Schema<IPreferencesDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' },
    notificationSettings: { type: Map, of: Boolean, default: {} },
    feedPreferences: { type: Map, of: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const PreferencesModel = mongoose.model<IPreferencesDocument>('Preferences', PreferencesSchema);
