"use client";

import { useServerActionClientRequest } from "@/hooks";
import { protectedRoute } from "./actions";
import { FC, useEffect } from "react";
import { ProtectedRouteProps } from "./types";
import { LoadingSpinner } from "../LoadingSpinner";

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoading, wrappedCallback } = useServerActionClientRequest<void>(
    protectedRoute,
    true
  );

  useEffect(() => {
    wrappedCallback();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return children;
};
