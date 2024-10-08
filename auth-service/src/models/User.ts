import { Schema, Types, model } from "mongoose";

export type UserType = {
  username: string;
  password: string;
  totpSecret: string;
  _id: Types.ObjectId;
  __v: number;
};

export const userSchema = new Schema<UserType>({
  username: { unique: true, type: String, required: true },
  password: { type: String, required: true },
  totpSecret: { unique: true, type: String, required: true },
});

export const User = model<UserType>("User", userSchema);
