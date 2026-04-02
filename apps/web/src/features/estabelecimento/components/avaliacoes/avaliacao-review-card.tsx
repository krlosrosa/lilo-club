"use client";

import { Calendar, Flag, MessageCircleReply, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AvaliacoesStarRow } from "./avaliacoes-star-row";
import { clienteLabel, formatReviewDate, type AvaliacaoItem } from "../../utils/avaliacoes";

export interface AvaliacaoReviewCardProps {
  avaliacao: AvaliacaoItem;
  onOpenReply: (a: AvaliacaoItem) => void;
}

export function AvaliacaoReviewCard({ avaliacao: a, onOpenReply }: AvaliacaoReviewCardProps) {
  return (
    <article
      className={cn(
        "bg-card rounded-xl border p-6 shadow-sm transition-shadow sm:p-8",
        a.destaquePositivo ? "border-primary/20 relative overflow-hidden" : "hover:shadow-md",
      )}
    >
      {a.destaquePositivo ? (
        <div className="absolute top-0 right-0 p-4">
          <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase">
            Destaque positivo
          </span>
        </div>
      ) : null}
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="flex shrink-0 flex-col items-center text-center md:items-start md:text-left">
          <div className="mb-3 flex size-16 items-center justify-center overflow-hidden rounded-2xl bg-muted">
            <span className="text-muted-foreground text-xl font-bold">
              {clienteLabel(a)
                .replace("Cliente ", "")
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>
          <h3 className="font-bold">{clienteLabel(a)}</h3>
          <p className="text-muted-foreground text-xs font-medium">Avaliação verificada</p>
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <AvaliacoesStarRow nota={a.nota} />
            <time className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
              <Calendar className="size-3.5 opacity-70" />
              {formatReviewDate(a.createdAt)}
            </time>
          </div>
          {a.comentario ? (
            <p
              className={cn(
                "mb-6 text-lg leading-relaxed",
                a.nota >= 4 ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {a.comentario}
            </p>
          ) : (
            <p className="text-muted-foreground mb-6 text-sm italic">Sem comentário.</p>
          )}

          {a.resposta?.trim() ? (
            <div className="border-primary/30 bg-muted/40 mb-6 rounded-lg border-l-4 p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-primary text-xs font-bold tracking-tighter uppercase">Sua resposta</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary h-auto p-0 text-[10px] font-bold"
                  onClick={() => onOpenReply(a)}
                >
                  Editar
                </Button>
              </div>
              <p className="text-muted-foreground text-sm italic">&ldquo;{a.resposta}&rdquo;</p>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-4">
              {!a.resposta?.trim() ? (
                <button
                  type="button"
                  className="text-primary flex items-center gap-2 text-xs font-bold hover:underline"
                  onClick={() => onOpenReply(a)}
                >
                  <MessageCircleReply className="size-4" />
                  Responder
                </button>
              ) : null}
              <span className="text-muted-foreground flex items-center gap-2 text-xs font-bold">
                <ThumbsUp className="size-4" />
                Útil ({a.utilCount})
              </span>
            </div>
            <button
              type="button"
              className="text-muted-foreground/40 hover:text-destructive transition-colors"
              aria-label="Reportar"
              onClick={() => toast.message("Denúncia em breve.")}
            >
              <Flag className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
