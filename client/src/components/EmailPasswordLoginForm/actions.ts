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
    const response = await api<Response<PreLoginResponse>>({
      route: ApiRoutes.PRE_LOGIN,
      config: {
        method: "POST",
        body: JSON.stringify(data),
      },
    });

    const { data: responseData } = response;

    if (!responseData) {
      throw new Error();
    }

    redirectUrl = `${Routes.LOGIN}?step=1&token=${encodeURIComponent(
      responseData.preLoginToken
    )}`;
  } catch (e: any) {
    const errorData = e?.message && JSON.parse(e.message);
    const errorMessage =
      errorData?.error?.message ||
      "Щось пішло не так. Спробуйте ще раз пізніше.";

    redirectUrl = `${Routes.LOGIN}?step=0&errorMessage=${encodeURIComponent(
      errorMessage
    )}`;
  } finally {
    redirect(redirectUrl);
  }
}
