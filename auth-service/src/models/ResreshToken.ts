import { Schema, Types, model } from "mongoose";

export type RefreshTokenType = {
  user: Types.ObjectId;
  token: string;
  _id: Types.ObjectId;
  __v: number;
};

export const refreshTokenSchema = new Schema<RefreshTokenType>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  token: { type: String, required: true, unique: true },
});

export const RefreshToken = model<RefreshTokenType>(
  "RefreshToken",
  refreshTokenSchema
);
