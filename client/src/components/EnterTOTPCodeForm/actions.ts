"use server";

import { Response } from "@/types/Response";
import { api } from "@/utils/api";
import { redirect } from "next/navigation";
import { LoginResponse } from "@/types/LoginResponse";

export async function submitForm(token: string, totpCode: string) {
  let redirectUrl = "";
  try {
    const response = await api.post<Response<LoginResponse>>(
      "/auth/login/f2a-login",
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

    redirectUrl = `/auth/login?step=2`;
  } catch (e: any) {
    const errorMessage =
      e?.response?.data?.error?.message ||
      "Щось пішло не так. Спробуйте ще раз пізніше.";

    redirectUrl = `/auth/login?step=1&token=${encodeURIComponent(
      token
    )}&errorMessage=${encodeURIComponent(errorMessage)}`;
  } finally {
    redirect(redirectUrl);
  }
}
