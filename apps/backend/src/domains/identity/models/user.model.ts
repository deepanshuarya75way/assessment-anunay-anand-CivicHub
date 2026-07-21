import mongoose, { Schema, Document } from 'mongoose';
import { AccountStatus, Role } from '@civichub/shared';

export interface IUserDocument extends Document {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: AccountStatus;

  googleId?: string;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false }, // Optional for Google OAuth users
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    status: { type: String, enum: Object.values(AccountStatus), default: AccountStatus.PENDING_VERIFICATION },

    googleId: { type: String, required: false, unique: true, sparse: true },
    tokenVersion: { type: Number, default: 0 },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true, transform: (doc, ret: any) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } },
    toObject: { virtuals: true, transform: (doc, ret: any) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } }
  }
);

// Indexes for faster lookups
export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
