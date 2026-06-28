import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types";
import type { User } from "@/types";

export function useCurrentUser() {
  const { user: clerkUser, isLoaded } = useUser();

  const query = useQuery<ApiResponse<User>>({
    queryKey: ["current-user"],
    queryFn: () => usersApi.me(),
    enabled: isLoaded && !!clerkUser,
  });

  const user = query.data?.data;

  return {
    user,
    isLoading: !isLoaded || query.isLoading,
    role: user?.role,
    agencyId: user?.agencyId,
  };
}
