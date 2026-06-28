"use client";

import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types";
import type { User } from "@/types";

export function useUsers() {
  return useQuery<ApiResponse<User[]>>({
    queryKey: ["users"],
    queryFn: () => usersApi.list(),
  });
}
