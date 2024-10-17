"use server";

import { SessionManagement } from "@/services/SessionManagement";

export const protectedRoute = async () => {
  await SessionManagement.protectedRoute();
};
