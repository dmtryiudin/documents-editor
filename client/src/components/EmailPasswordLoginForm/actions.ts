"use server";

import { Response } from "@/types/Response";
import { FormValues } from "./types";
import { api } from "@/utils/api";
import { redirect } from "next/navigation";
import { PreLoginResponse } from "@/types/PreLoginResponse";
import { ApiRoutes, Routes } from "@/types/Routes";

export async function submitForm(data: FormValues) {
  let redirectUrl = "";
  try {
    const response = await api.post<Response<PreLoginResponse>>(
      ApiRoutes.PRE_LOGIN,
      data
    );

    const { data: responseData } = response.data;

    if (!responseData) {
      throw new Error();
    }

    redirectUrl = `${Routes.LOGIN}?step=1&token=${encodeURIComponent(
      responseData.preLoginToken
    )}`;
  } catch (e: any) {
    const errorMessage =
      e?.response?.data?.error?.message ||
      "Щось пішло не так. Спробуйте ще раз пізніше.";

    redirectUrl = `${Routes.LOGIN}?step=0&errorMessage=${encodeURIComponent(
      errorMessage
    )}`;
  } finally {
    redirect(redirectUrl);
  }
}
