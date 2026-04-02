"use client";

import { createApiClient } from "@lilo-hub/clients";
import { useMemo } from "react";
import { useHealthQuery } from "@/hooks/use-health-query";
import { getApiBaseUrl } from "@/lib/auth";

export function HealthStatus() {
  const api = useMemo(
    () => createApiClient({ baseUrl: getApiBaseUrl() }),
    [],
  );
  const { data, isLoading, isError } = useHealthQuery(api);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">API: carregando…</p>;
  }
  if (isError) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        API: indisponível (sem resposta em{" "}
        <code className="rounded bg-muted px-1 text-xs">{getApiBaseUrl()}</code>)
      </p>
    );
  }
  return (
    <p className="text-sm text-muted-foreground">
      API: <span className="font-medium text-foreground">{data?.status}</span> —{" "}
      {data?.service}
    </p>
  );
}
