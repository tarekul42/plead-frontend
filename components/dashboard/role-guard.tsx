"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { ReactNode } from "react";

export function RoleGuard({
  allowedRoles,
  children,
  fallback,
}: {
  allowedRoles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user: clerkUser, isLoaded } = useUser();

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: () =>
      apiClient.get("/users/me").then((r) => r.data.data),
    enabled: isLoaded && !!clerkUser,
  });

  if (!isLoaded) return null;
  if (!user) return null;
  if (!allowedRoles.includes(user.role)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
