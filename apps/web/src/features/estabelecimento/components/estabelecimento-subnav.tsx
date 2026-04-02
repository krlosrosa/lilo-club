"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "" as const, label: "Informações" },
  { path: "endereco" as const, label: "Endereço" },
  { path: "horario" as const, label: "Horários" },
  { path: "midias" as const, label: "Mídias" },
  { path: "avaliacoes" as const, label: "Avaliações" },
];

export interface EstabelecimentoSubnavProps {
  estabelecimentoId: string;
}

export function EstabelecimentoSubnav({ estabelecimentoId }: EstabelecimentoSubnavProps) {
  const segments = useSelectedLayoutSegments();
  const activeSegment = segments[0] ?? "";

  const base = `/estabelecimentos/${estabelecimentoId}`;

  return (
    <nav className="border-border mb-4 flex flex-wrap gap-2 border-b pb-2">
      {tabs.map((t) => {
        const href = t.path ? `${base}/${t.path}` : base;
        const isActive = activeSegment === t.path;
        return (
          <Link
            key={t.path || "inicio"}
            href={href}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
