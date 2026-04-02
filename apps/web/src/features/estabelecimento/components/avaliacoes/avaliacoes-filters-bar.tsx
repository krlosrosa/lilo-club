"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AVALIACOES_PAGE_SIZE } from "../../constants";

export interface AvaliacoesFiltersBarProps {
  notaFiltro: string;
  setNotaFiltro: (v: string) => void;
  ordem: string;
  setOrdem: (v: string) => void;
  semResposta: boolean;
  toggleSemResposta: () => void;
  search: string;
  setSearch: (v: string) => void;
  resetPage: () => void;
}

export function AvaliacoesFiltersBar({
  notaFiltro,
  setNotaFiltro,
  ordem,
  setOrdem,
  semResposta,
  toggleSemResposta,
  search,
  setSearch,
  resetPage,
}: AvaliacoesFiltersBarProps) {
  return (
    <section className="bg-muted/60 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <select
            className="bg-card border-input appearance-none rounded-xl border px-4 py-3 pr-10 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-primary/20"
            value={notaFiltro}
            onChange={(e) => {
              setNotaFiltro(e.target.value);
              resetPage();
            }}
          >
            <option value="todas">Todas as notas</option>
            <option value="5">5 estrelas</option>
            <option value="4">4 estrelas</option>
            <option value="3">3 estrelas</option>
            <option value="baixas">Críticas (1–2)</option>
          </select>
        </div>
        <div className="relative">
          <select
            className="bg-card border-input appearance-none rounded-xl border px-4 py-3 pr-10 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-primary/20"
            value={ordem}
            onChange={(e) => setOrdem(e.target.value)}
          >
            <option value="recentes">Mais recentes</option>
            <option value="antigas">Mais antigas</option>
            <option value="relevantes">Mais relevantes</option>
          </select>
        </div>
        <div className="bg-border mx-2 hidden h-8 w-px md:block" />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={cn(
              "rounded-lg px-4 py-2 text-xs font-bold tracking-wider uppercase transition-colors",
              semResposta
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
            onClick={() => {
              toggleSemResposta();
              resetPage();
            }}
          >
            Sem resposta
          </button>
        </div>
      </div>
      <div className="relative w-full md:w-72">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          className="rounded-xl border-0 bg-card pl-10 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20"
          placeholder="Buscar comentário…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetPage();
          }}
        />
      </div>
      <p className="text-muted-foreground w-full text-xs">
        Filtros aplicam-se à página atual ({AVALIACOES_PAGE_SIZE} itens).
      </p>
    </section>
  );
}
