"use server";

import { Response } from "@/types/Response";
import { FormValues } from "./types";
import { api } from "@/utils/api";
import { redirect } from "next/navigation";
import { PreLoginResponse } from "@/types/PreLoginResponse";

export async function submitForm(data: FormValues) {
  let redirectUrl = "";
  try {
    const response = await api.post<Response<PreLoginResponse>>(
      "/auth/login/pre-login",
      data
    );

    const { data: responseData } = response.data;

    if (!responseData) {
      throw new Error();
    }

    redirectUrl = `/auth/login?step=1&token=${encodeURIComponent(
      responseData.preLoginToken
    )}`;
  } catch (e: any) {
    const errorMessage =
      e?.response?.data?.error?.message ||
      "Щось пішло не так. Спробуйте ще раз пізніше.";

    redirectUrl = `/auth/login?step=0&errorMessage=${encodeURIComponent(
      errorMessage
    )}`;
  } finally {
    redirect(redirectUrl);
  }
}
