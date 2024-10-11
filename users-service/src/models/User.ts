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
  username: {
    unique: true,
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  password: { type: String, required: true, minlength: 8 },
  totpSecret: { unique: true, type: String, required: true },
  encryptTotpSecretIv: { type: String, required: true },
  firstName: { type: String, minlength: 3, maxlength: 30 },
  lastName: { type: String, minlength: 3, maxlength: 30 },
});

export const User = model<UserType>("User", userSchema);
