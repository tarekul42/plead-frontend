"use client";

import { ReactNode } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

export function RoleGuard({
  allowedRoles,
  children,
  fallback,
}: {
  allowedRoles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) return null;
  if (!user) return null;
  if (!allowedRoles.includes(user.role)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
