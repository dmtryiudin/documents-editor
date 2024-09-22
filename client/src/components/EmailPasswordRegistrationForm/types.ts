import { z } from "zod";

export type FormValues = {
  username: string;
  password: string;
};

export const RegistrationPayloadValidation = z.object({
  username: z
    .string({ message: "Має бути строкою" })
    .min(3, { message: "Має містити принаймні 3 символи" })
    .max(30, { message: "Має містити не більше 30 символів" }),
  password: z
    .string({ message: "Має бути строкою" })
    .min(8, { message: "Має містити принаймні 8 символів" }),
});
