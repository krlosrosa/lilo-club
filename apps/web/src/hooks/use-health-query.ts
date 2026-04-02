"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { HealthResponse } from "@lilo-hub/contracts";
import type { ApiClient } from "@lilo-hub/clients";

export type UseHealthQueryResult = UseQueryResult<HealthResponse, Error>;

export function useHealthQuery(
  client: ApiClient,
  options?: { enabled?: boolean },
): UseHealthQueryResult {
  return useQuery({
    queryKey: ["health"],
    queryFn: () => client.getHealth(),
    enabled: options?.enabled ?? true,
  });
}
