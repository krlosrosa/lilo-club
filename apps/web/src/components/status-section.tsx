"use client";

import dynamic from "next/dynamic";

const HealthStatus = dynamic(
  () => import("./health-status").then((m) => m.HealthStatus),
  {
    ssr: false,
    loading: () => <p className="text-sm text-muted-foreground">API: …</p>,
  },
);

export function StatusSection() {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="mb-2 text-sm font-medium text-muted-foreground">Status</h2>
      <HealthStatus />
    </section>
  );
}
