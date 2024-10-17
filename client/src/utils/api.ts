"use server";

import { SessionManagement } from "@/services/SessionManagement";
import { ApiRoutes } from "@/types/Routes";

export async function api<T>(params: {
  route: ApiRoutes;
  config?: RequestInit;
  isProtected?: boolean;
  content?: "application/json";
  avoidRefresh?: boolean;
}) {
  const { route, config, isProtected, content, avoidRefresh } = params;
  const url = process.env.API_GATEWAY_URL + route;
  const contentType = content || "application/json";

  const headers = {
    ...config?.headers,
    "Content-Type": contentType,
  } as { [key: string]: string };

  if (isProtected) {
    const session = await SessionManagement.getSession(true);
    if (session) {
      headers["Authorization"] = `Bearer ${session.accessToken}`;
    }
  }

  const response = await fetch(url, { ...config, headers });
  const data = await response.json();

  if (response.status === 401 && !avoidRefresh && isProtected) {
    await SessionManagement.refreshToken();
    return api({ ...params, avoidRefresh: true });
  }

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data as T;
}
