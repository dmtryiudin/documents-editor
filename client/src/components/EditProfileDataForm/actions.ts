"use server";

import { Response } from "@/types/Response";
import { FormValues } from "./types";
import { User } from "@/types/User";
import { ApiRoutes, Routes } from "@/types/Routes";
import { api } from "@/utils/api";
import { SessionManagement } from "@/services/SessionManagement";
import { redirect } from "next/navigation";

export async function submitForm(data: FormValues) {
  let redirectUrl = "";
  let isSuccess = false;

  try {
    const response = await api<Response<User>>({
      route: ApiRoutes.USERS,
      config: {
        method: "PUT",
        body: JSON.stringify(data),
      },
      isProtected: true,
    });

    const { data: responseData } = response;

    if (!responseData) {
      throw new Error();
    }

    const session = await SessionManagement.getSession(true);

    if (!session) {
      throw new Error();
    }

    await SessionManagement.setSession({ ...session, user: responseData });

    redirectUrl = `${Routes.PROFILE_SETTINGS}`;
    isSuccess = true;
  } catch (e: any) {
    const errorData = e?.message && JSON.parse(e.message);
    const errorMessage =
      errorData?.error?.message ||
      "Щось пішло не так. Спробуйте ще раз пізніше.";

    redirectUrl = `${Routes.PROFILE_SETTINGS}?errorMessage=${encodeURIComponent(
      errorMessage
    )}`;
  } finally {
    return { redirectUrl, isSuccess };
  }
}

export async function deleteAccountHandler() {
  let redirectUrl = "";

  try {
    await api({
      route: ApiRoutes.USERS,
      config: {
        method: "DELETE",
      },
      isProtected: true,
    });

    redirectUrl = `${Routes.LOGOUT}`;
  } catch (e: any) {
    const errorData = e?.message && JSON.parse(e.message);
    const errorMessage =
      errorData?.error?.message ||
      "Щось пішло не так. Спробуйте ще раз пізніше.";

    redirectUrl = `${Routes.PROFILE_SETTINGS}?errorMessage=${encodeURIComponent(
      errorMessage
    )}`;
  } finally {
    redirect(redirectUrl);
  }
}
