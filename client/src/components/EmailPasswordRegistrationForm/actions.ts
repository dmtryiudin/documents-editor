"use server";

import { Response } from "@/types/Response";
import { FormValues } from "./types";
import { api } from "@/utils/api";
import { redirect } from "next/navigation";
import { RegistrationResponse } from "@/types/RegistrationResponse";

export async function submitForm(data: FormValues) {
  let redirectUrl = "";
  try {
    const response = await api.post<Response<RegistrationResponse>>(
      "/auth/registration",
      data
    );

    const { data: responseData } = response.data;

    if (!responseData) {
      throw new Error();
    }

    redirectUrl = `/auth/registration?step=1&totpUri=${encodeURIComponent(
      responseData.totpUri
    )}`;
  } catch (e: any) {
    const errorMessage =
      e?.response?.data?.error?.message ||
      "Щось пішло не так. Спробуйте ще раз пізніше.";

    redirectUrl = `/auth/registration?step=0&errorMessage=${encodeURIComponent(
      errorMessage
    )}`;
  } finally {
    redirect(redirectUrl);
  }
}
