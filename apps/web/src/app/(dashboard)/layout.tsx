import type { ReactNode } from "react";
import { DashboardAuthGate, DashboardShell } from "@/features/dashboard";

export default function DashboardGroupLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardAuthGate>
      <DashboardShell>{children}</DashboardShell>
    </DashboardAuthGate>
  );
}
