"use client";

import { Eye, Info, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface EstabelecimentoGeralSidebarProps {
  publicado: boolean;
  setPublicado: (v: boolean) => void;
  destaque: boolean;
  setDestaque: (v: boolean) => void;
}

export function EstabelecimentoGeralSidebar({
  publicado,
  setPublicado,
  destaque,
  setDestaque,
}: EstabelecimentoGeralSidebarProps) {
  return (
    <aside className="space-y-5 lg:col-span-4">
      <section className="bg-card rounded-xl border border-border/60 p-4 shadow-sm sm:p-5">
        <h2 className="mb-4 text-base font-semibold sm:mb-5 sm:text-lg">Configurações de exibição</h2>
        <div className="space-y-4 sm:space-y-5">
          <div
            className={cn(
              "rounded-xl border p-3.5 sm:p-4",
              "border-border/80 bg-muted/25",
            )}
          >
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <div className="bg-background flex size-9 shrink-0 items-center justify-center rounded-full border border-border/60 text-primary shadow-sm sm:size-10">
                  <Eye className="size-4 sm:size-[18px]" />
                </div>
                <p className="text-sm font-medium">Publicado</p>
              </div>
              <Switch checked={publicado} onCheckedChange={setPublicado} />
            </div>
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide sm:text-[10px]",
                publicado
                  ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "mr-1.5 size-1.5 shrink-0 rounded-full",
                  publicado ? "bg-emerald-500" : "bg-muted-foreground/50",
                )}
              />
              {publicado ? "Ativo no portal" : "Rascunho"}
            </span>
          </div>

          <div
            className={cn(
              "rounded-xl border p-3.5 sm:p-4",
              "border-border/80 bg-muted/25",
            )}
          >
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <div className="bg-background text-primary flex size-9 shrink-0 items-center justify-center rounded-full border border-border/60 shadow-sm sm:size-10">
                  <Star className="size-4 sm:size-[18px]" />
                </div>
                <p className="text-sm font-medium">Destaque</p>
              </div>
              <Switch checked={destaque} onCheckedChange={setDestaque} />
            </div>
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide sm:text-[10px]",
                destaque
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "mr-1.5 size-1.5 shrink-0 rounded-full",
                  destaque ? "bg-primary" : "bg-muted-foreground/50",
                )}
              />
              {destaque ? "Topo das buscas" : "Ordem padrão"}
            </span>
          </div>
        </div>
      </section>

      <section className="bg-primary/5 border-primary/15 rounded-xl border p-4 sm:p-5">
        <div className="text-primary mb-2 flex items-center gap-2 sm:mb-3">
          <Info className="size-4 shrink-0" />
          <h3 className="text-sm font-semibold sm:text-base">Dica de curadoria</h3>
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
          O <strong className="text-foreground font-medium">Peso de destaque</strong> influencia como
          o sistema ordena estabelecimentos equivalentes. Quanto maior o peso, maior a visibilidade
          na home e nos resultados de busca.
        </p>
      </section>
    </aside>
  );
}
