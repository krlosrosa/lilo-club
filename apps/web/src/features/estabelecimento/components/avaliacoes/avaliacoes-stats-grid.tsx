"use client";

import { Sparkles, TrendingUp } from "lucide-react";
import { AvaliacoesStarRow } from "./avaliacoes-star-row";

export interface AvaliacoesStatsGridProps {
  notaMedia: number | null;
  totalAval: number;
  taxaResposta: number | null;
  sampleLen: number;
  totalFromList: number;
  novasHoje: number;
}

export function AvaliacoesStatsGrid({
  notaMedia,
  totalAval,
  taxaResposta,
  sampleLen,
  totalFromList,
  novasHoje,
}: AvaliacoesStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
      <div className="bg-primary text-primary-foreground flex flex-col justify-between rounded-xl p-6 shadow-sm md:col-span-1">
        <span className="text-sm font-semibold tracking-wider uppercase opacity-80">Nota média</span>
        <div>
          <div className="text-5xl leading-none font-extrabold">
            {notaMedia != null ? notaMedia.toFixed(1) : "—"}
          </div>
          {notaMedia != null ? (
            <div className="mt-2">
              <AvaliacoesStarRow nota={Math.round(notaMedia)} size="large" />
            </div>
          ) : null}
        </div>
      </div>
      <div className="bg-card flex flex-col justify-center rounded-xl p-6 shadow-sm">
        <span className="text-muted-foreground mb-1 text-sm font-medium">Total de avaliações</span>
        <div className="text-3xl font-bold">{totalAval.toLocaleString("pt-BR")}</div>
        <span className="text-primary mt-2 flex items-center gap-1 text-xs font-bold">
          <TrendingUp className="size-3.5" />
          Painel do estabelecimento
        </span>
      </div>
      <div className="border-primary bg-card flex flex-col justify-center rounded-xl border-l-4 p-6 shadow-sm">
        <span className="text-muted-foreground mb-1 text-sm font-medium">Taxa de resposta</span>
        <div className="text-3xl font-bold">{taxaResposta != null ? `${taxaResposta}%` : "—"}</div>
        {taxaResposta != null ? (
          <div className="bg-muted mt-4 h-1.5 w-full rounded-full">
            <div
              className="bg-secondary h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, taxaResposta)}%` }}
            />
          </div>
        ) : null}
        {sampleLen > 0 && totalFromList > sampleLen ? (
          <p className="text-muted-foreground mt-2 text-[10px]">Amostra de {sampleLen} avaliações recentes</p>
        ) : null}
      </div>
      <div className="bg-card flex flex-col justify-center rounded-xl p-6 shadow-sm">
        <span className="text-muted-foreground mb-1 text-sm font-medium">Novas hoje</span>
        <div className="text-3xl font-bold">{novasHoje}</div>
        <div className="text-muted-foreground mt-3 flex items-center gap-2 text-xs">
          <Sparkles className="text-primary size-4 shrink-0" />
          Na amostra exibida acima
        </div>
      </div>
    </div>
  );
}
