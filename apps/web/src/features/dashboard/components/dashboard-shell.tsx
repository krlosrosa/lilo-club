"use client";

import type { ReactNode } from "react";
import { DashboardSidebar } from "./dashboard-sidebar";

export interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      <DashboardSidebar />
      <div className="min-w-0 flex-1 p-4 md:p-8">{children}</div>
    </div>
  );
}
