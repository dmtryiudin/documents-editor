"use server";

import { SessionManagement } from "@/services/SessionManagement";
import { Routes } from "@/types/Routes";
import { redirect } from "next/navigation";

export const logout = async () => {
  await SessionManagement.logout();
  redirect(Routes.LOGIN);
};
