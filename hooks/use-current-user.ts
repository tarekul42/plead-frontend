import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { User } from "@/types";

export function useCurrentUser() {
  const { user: clerkUser, isLoaded } = useUser();

  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: () =>
      apiClient.get("/users/me").then((r) => r.data.data as User),
    enabled: isLoaded && !!clerkUser,
  });

  return {
    user: query.data,
    isLoading: !isLoaded || query.isLoading,
    role: query.data?.role,
    agencyId: query.data?.agencyId,
  };
}
