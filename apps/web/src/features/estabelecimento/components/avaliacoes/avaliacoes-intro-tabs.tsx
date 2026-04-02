"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type AvaliacoesTab = "geral" | "relatorios";

export interface AvaliacoesIntroTabsProps {
  tab: AvaliacoesTab;
  onTabChange: (t: AvaliacoesTab) => void;
}

export function AvaliacoesIntroTabs({ tab, onTabChange }: AvaliacoesIntroTabsProps) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="text-foreground mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Avaliações</h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Gerencie o feedback dos seus clientes e a reputação do seu negócio.
        </p>
      </div>
      <div className="bg-muted flex items-center gap-1 rounded-xl p-2">
        <button
          type="button"
          onClick={() => onTabChange("geral")}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
            tab === "geral" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/80",
          )}
        >
          Visão geral
        </button>
        <button
          type="button"
          onClick={() => {
            onTabChange("relatorios");
            toast.message("Relatórios em breve.");
          }}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
            tab === "relatorios" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/80",
          )}
        >
          Relatórios
        </button>
      </div>
    </div>
  );
}
