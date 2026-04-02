"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AVALIACOES_PAGE_SIZE } from "../../constants";

export interface AvaliacoesPaginationFooterProps {
  page: number;
  total: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export function AvaliacoesPaginationFooter({
  page,
  total,
  totalPages,
  onPrev,
  onNext,
}: AvaliacoesPaginationFooterProps) {
  return (
    <footer className="bg-muted/60 flex flex-col items-center justify-between gap-4 rounded-xl p-4 sm:flex-row">
      <div className="text-muted-foreground text-sm font-medium">
        Mostrando{" "}
        <span className="text-foreground font-bold">
          {total === 0 ? 0 : page * AVALIACOES_PAGE_SIZE + 1}-{Math.min((page + 1) * AVALIACOES_PAGE_SIZE, total)}
        </span>{" "}
        de <span className="text-foreground font-bold">{total.toLocaleString("pt-BR")}</span> avaliações
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
        <Button type="button" variant="ghost" size="icon" className="size-10" disabled={page <= 0} onClick={onPrev}>
          <ChevronLeft className="size-5" />
        </Button>
        <span className="text-muted-foreground px-2 text-sm font-medium">
          Página {Math.min(page + 1, totalPages)} / {totalPages}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10"
          disabled={page + 1 >= totalPages}
          onClick={onNext}
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </footer>
  );
}
