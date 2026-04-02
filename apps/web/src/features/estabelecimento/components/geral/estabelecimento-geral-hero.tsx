"use client";

import { Star, Store } from "lucide-react";
import type { CategoriaOption } from "../../types";

export interface EstabelecimentoGeralHeroProps {
  nome: string;
  initialNome: string;
  destaque: boolean;
  categoriaId: string;
  categorias: CategoriaOption[];
  categoriaNomeFallback: string;
  capaUrl: string | null;
  logoUrl: string | null;
  scoreText: string;
  totalAvaliacoes: number;
}

export function EstabelecimentoGeralHero({
  nome,
  initialNome,
  destaque,
  categoriaId,
  categorias,
  categoriaNomeFallback,
  capaUrl,
  logoUrl,
  scoreText,
  totalAvaliacoes,
}: EstabelecimentoGeralHeroProps) {
  return (
    <div className="group relative h-48 overflow-hidden rounded-xl sm:h-56">
      {capaUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- URLs dinâmicas de mídia (API)
        <img alt="" className="size-full object-cover brightness-[0.85]" src={capaUrl} />
      ) : (
        <div className="size-full bg-linear-to-br from-muted via-muted/80 to-muted/60" />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex w-full flex-col gap-3 p-3 sm:flex-row sm:items-end sm:gap-4 sm:p-4">
        <div className="h-16 w-16 shrink-0 rounded-lg bg-background p-0.5 shadow-md sm:h-20 sm:w-20 sm:rounded-xl sm:p-1">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" className="size-full rounded-md object-cover sm:rounded-lg" src={logoUrl} />
          ) : (
            <div className="bg-muted flex size-full items-center justify-center rounded-md sm:rounded-lg">
              <Store className="text-muted-foreground size-7 sm:size-8" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 pb-0 sm:pb-1">
          <div className="mb-0.5 flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl md:text-2xl">
              {nome || initialNome}
            </h1>
            {destaque ? (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary-foreground">
                Premium
              </span>
            ) : null}
          </div>
          <p className="text-sm font-normal text-white/80">
            {categorias.find((c) => c.id === categoriaId)?.nome ?? categoriaNomeFallback}
          </p>
        </div>
        <div className="flex shrink-0 gap-2 pb-0 sm:gap-3 sm:pb-1">
          <div className="border-white/15 bg-white/10 supports-backdrop-filter:backdrop-blur-sm min-w-[88px] rounded-lg border p-2 text-center sm:min-w-[100px] sm:rounded-xl sm:p-2.5">
            <p className="text-white/55 mb-0.5 text-[9px] font-medium uppercase tracking-wider sm:text-[10px]">
              Score
            </p>
            <div className="flex items-center justify-center gap-1 text-white">
              <span className="text-base font-semibold sm:text-lg">{scoreText}</span>
              <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
            </div>
          </div>
          <div className="border-white/15 bg-white/10 supports-backdrop-filter:backdrop-blur-sm min-w-[88px] rounded-lg border p-2 text-center sm:min-w-[100px] sm:rounded-xl sm:p-2.5">
            <p className="text-white/55 mb-0.5 text-[9px] font-medium uppercase tracking-wider sm:text-[10px]">
              Reviews
            </p>
            <p className="text-base font-semibold text-white sm:text-lg">{totalAvaliacoes}</p>
          </div>

        </div>
      </div>
    </div>
  );
}
