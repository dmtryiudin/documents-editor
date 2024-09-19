import { z } from "zod";

export type FormValues = {
  username: string;
  password: string;
};

export const LoginPayloadValidation = z.object({
  username: z
    .string({ message: "Має бути строкою" })
    .min(1, { message: "Поле обов'язкове" }),
  password: z
    .string({ message: "Має бути строкою" })
    .min(1, { message: "Поле обов'язкове" }),
});
