import { Schema, Types, model } from "mongoose";

export type UserType = {
  username: string;
  password: string;
  totpSecret: string;
  firstName: string;
  lastName: string;
  encryptTotpSecretIv: string;
  _id: Types.ObjectId;
  __v: number;
};

export const userSchema = new Schema<UserType>({
  username: { unique: true, type: String, required: true },
  password: { type: String, required: true },
  totpSecret: { unique: true, type: String, required: true },
  encryptTotpSecretIv: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
});

export const User = model<UserType>("User", userSchema);
