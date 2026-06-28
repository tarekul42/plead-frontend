"use client";

import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api-client";
import type { PaginationMeta } from "@/types";
import type { User } from "@/types";

type PaginatedUsers = { data: User[]; meta?: PaginationMeta };

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.list() as Promise<PaginatedUsers>,
  });
}
