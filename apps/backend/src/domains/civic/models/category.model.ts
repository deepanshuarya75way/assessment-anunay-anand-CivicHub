import mongoose, { Schema, Document } from 'mongoose';
import { Category } from '@civichub/shared';

export interface ICategoryDocument extends Omit<Category, 'id'>, Document {
  id: string;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, unique: true },
    parentId: { type: String, default: null }, // for nested categories
  },
  { timestamps: true }
);

CategorySchema.index({ name: 'text' });
CategorySchema.index({ parentId: 1 });

export const CategoryModel = mongoose.model<ICategoryDocument>('Category', CategorySchema);
