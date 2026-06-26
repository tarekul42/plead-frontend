"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/models";

export function useUsers() {
  return useQuery<ApiResponse<User[]>>({
    queryKey: ["users"],
    queryFn: () => usersApi.list(),
  });
}
