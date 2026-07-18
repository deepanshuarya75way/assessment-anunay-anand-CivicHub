import mongoose, { Schema, Document } from 'mongoose';

export enum TokenType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export interface ITokenDocument extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  type: TokenType;
  expiresAt: Date;
  createdAt: Date;
}

const TokenSchema = new Schema<ITokenDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tokenHash: { type: String, required: true, unique: true },
    type: { type: String, enum: Object.values(TokenType), required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL index to automatically remove expired tokens
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const TokenModel = mongoose.model<ITokenDocument>('Token', TokenSchema);
