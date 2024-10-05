"use server";

import { Response } from "@/types/Response";
import { api } from "@/utils/api";
import { redirect } from "next/navigation";
import { Session } from "@/types/Session";
import { SessionManagement } from "@/services/SessionManagement";
import { ApiRoutes, Routes } from "@/types/Routes";
import { FormValues } from "./types";

export async function submitForm({ token, totpCode }: FormValues) {
  let redirectUrl = "";
  try {
    const response = await api.post<Response<Session>>(
      ApiRoutes.F2A_LOGIN,
      { totpCode },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { data: responseData } = response.data;

    if (!responseData) {
      throw new Error();
    }

    redirectUrl = `${Routes.LOGIN}?step=2`;
    await SessionManagement.setSession(responseData);
  } catch (e: any) {
    const errorMessage =
      e?.response?.data?.error?.message ||
      "Щось пішло не так. Спробуйте ще раз пізніше.";

    redirectUrl = `${Routes.LOGIN}?step=1&token=${encodeURIComponent(
      token
    )}&errorMessage=${encodeURIComponent(errorMessage)}`;
  } finally {
    redirect(redirectUrl);
  }
}
