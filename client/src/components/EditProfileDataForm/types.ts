import { Session } from "@/types/Session";
import { z } from "zod";

export type FormValues = {
  firstName: string;
  lastName: string;
};

export const EditProfileDataPayloadValidation = z.object({
  firstName: z
    .string({ message: "Має бути строкою" })
    .min(3, { message: "Має містити принаймні 3 символи" })
    .max(30, { message: "Має містити не більше 30 символів" })
    .optional()
    .or(z.literal("")),
  lastName: z
    .string({ message: "Має бути строкою" })
    .min(3, { message: "Має містити принаймні 3 символи" })
    .max(30, { message: "Має містити не більше 30 символів" })
    .optional()
    .or(z.literal("")),
});

export type EditProfileDataFormProps = {
  session: Omit<Session, "accessToken" | "refreshToken"> | null;
};
