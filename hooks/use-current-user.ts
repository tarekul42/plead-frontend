import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api-client";
import type { User } from "@/types";

export function useCurrentUser() {
  const { user: clerkUser, isLoaded } = useUser();

  const query = useQuery({
    queryKey: ["current-user", clerkUser?.id],
    queryFn: () => usersApi.me() as Promise<User>,
    enabled: isLoaded && !!clerkUser,
  });

  const user = query.data;

  const isLoading = !isLoaded || !clerkUser || query.isPending || query.isFetching;

  return {
    user,
    isLoading,
    isError: query.isError,
    error: query.error,
    role: user?.role,
    agencyId: user?.agencyId,
  };
}
