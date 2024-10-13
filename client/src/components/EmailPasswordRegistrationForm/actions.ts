"use server";

import { Response } from "@/types/Response";
import { FormValues } from "./types";
import { api } from "@/utils/api";
import { redirect } from "next/navigation";
import { RegistrationResponse } from "@/types/RegistrationResponse";
import { SessionManagement } from "@/services/SessionManagement";
import { ApiRoutes, Routes } from "@/types/Routes";

export async function submitForm(data: FormValues) {
  let redirectUrl = "";
  try {
    const response = await api<Response<RegistrationResponse>>({
      route: ApiRoutes.REGISTRATION,
      config: { method: "POST", body: JSON.stringify(data) },
    });

    const { data: responseData } = response;

    if (!responseData) {
      throw new Error();
    }

    redirectUrl = `${Routes.REGISTRATION}?step=1&totpUri=${encodeURIComponent(
      responseData.totpUri
    )}`;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { totpUri, ...rest } = responseData;
    await SessionManagement.setSession(rest);
  } catch (e: any) {
    const errorData = e?.message && JSON.parse(e.message);
    const errorMessage =
      errorData?.error?.message ||
      "Щось пішло не так. Спробуйте ще раз пізніше.";

    redirectUrl = `${
      Routes.REGISTRATION
    }?step=0&errorMessage=${encodeURIComponent(errorMessage)}`;
  } finally {
    redirect(redirectUrl);
  }
}
