import { model, Schema, Types } from "mongoose";

export type PreLoginTokenType = {
  user: Types.ObjectId;
  token: string;
  _id: Types.ObjectId;
  __v: number;
};

export const preLoginTokenSchema = new Schema<PreLoginTokenType>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  token: { type: String, required: true, unique: true },
});

export const PreLoginToken = model<PreLoginTokenType>(
  "PreLoginToken",
  preLoginTokenSchema
);
