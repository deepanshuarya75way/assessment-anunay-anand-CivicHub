import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from '../logging/logger';

export const connectDB = async () => {
  mongoose.set('toJSON', {
    virtuals: true,
    transform: (doc, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  });

  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
