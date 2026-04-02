"use client";

import { queryKeys } from "@lilo-hub/clients";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardBrowserApi } from "../api";

export interface DashboardAuthGateProps {
  children: ReactNode;
}

export function DashboardAuthGate({ children }: DashboardAuthGateProps) {
  const router = useRouter();
  const q = useQuery({
    queryKey: queryKeys.authMe,
    queryFn: () => dashboardBrowserApi.getMe(),
  });

  useEffect(() => {
    if (q.isError) router.replace("/login");
  }, [q.isError, router]);

  if (q.isPending) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full max-w-2xl" />
      </div>
    );
  }

  if (q.isError) return null;

  return <>{children}</>;
}
