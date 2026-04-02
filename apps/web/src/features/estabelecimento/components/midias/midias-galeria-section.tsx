"use client";

import {
  ArrowDown,
  ArrowUp,
  Eye,
  GripVertical,
  ImagePlus,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MidiaItem } from "../../types";

export interface MidiasGaleriaSectionProps {
  galeriaItems: MidiaItem[];
  itemsCount: number;
  maxMidias: number | null;
  canAddGaleria: boolean;
  uploadPending: boolean;
  onPickGaleria: () => void;
  onDeleteMidia: (id: string) => void;
  onReorderGaleria: (galeriaIndex: number, dir: -1 | 1) => void;
}

export function MidiasGaleriaSection({
  galeriaItems,
  itemsCount,
  maxMidias,
  canAddGaleria,
  uploadPending,
  onPickGaleria,
  onDeleteMidia,
  onReorderGaleria,
}: MidiasGaleriaSectionProps) {
  return (
    <div className="bg-card rounded-lg p-8 shadow-none">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Galeria de fotos</h3>
          <p className="text-muted-foreground text-sm">
            Reordene com as setas ou adicione novas mídias ao seu portfólio.
          </p>
        </div>
        <Button
          type="button"
          className="gap-2 rounded-full px-8 shadow-md"
          onClick={onPickGaleria}
          disabled={!canAddGaleria || uploadPending}
        >
          <ImagePlus className="size-4" />
          Adicionar mídia
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {galeriaItems.map((m, idx) => (
          <div
            key={m.id}
            className="group relative aspect-square cursor-grab overflow-hidden rounded-lg active:cursor-grabbing"
          >
            {m.urlPublica ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.urlPublica} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="bg-muted flex h-full items-center justify-center text-xs">Sem URL pública</div>
            )}
            <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/60 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex items-center justify-between">
                <GripVertical className="size-5 text-white" aria-hidden />
                <div className="flex gap-2">
                  {m.urlPublica ? (
                    <button
                      type="button"
                      className="flex size-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-primary"
                      onClick={() => window.open(m.urlPublica!, "_blank", "noopener,noreferrer")}
                    >
                      <Eye className="size-4" />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="flex size-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-destructive"
                    onClick={() => onDeleteMidia(m.id)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="hover:bg-primary flex size-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors"
                    onClick={() => onReorderGaleria(idx, -1)}
                    disabled={idx === 0}
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="hover:bg-primary flex size-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors"
                    onClick={() => onReorderGaleria(idx, 1)}
                    disabled={idx === galeriaItems.length - 1}
                  >
                    <ArrowDown className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {canAddGaleria ? (
          <button
            type="button"
            className={cn(
              "border-border bg-muted/30 group flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed",
              "transition-all hover:border-primary hover:bg-muted",
            )}
            onClick={onPickGaleria}
          >
            <div className="bg-background text-primary flex size-12 items-center justify-center rounded-full transition-transform group-hover:scale-110">
              <Plus className="size-6" />
            </div>
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Carregar</span>
          </button>
        ) : null}
      </div>

      <div className="border-border mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-6 md:justify-start">
          <div className="text-center">
            <span className="text-primary block text-2xl font-bold">
              {String(itemsCount).padStart(2, "0")} / {maxMidias == null ? "∞" : String(maxMidias).padStart(2, "0")}
            </span>
            <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Mídias usadas</span>
          </div>
          <div className="bg-border hidden h-10 w-px md:block" />
          <div className="text-center">
            <span className="text-primary block text-2xl font-bold">00 / 00</span>
            <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
              Vídeos (em breve)
            </span>
          </div>
        </div>
        <div className="bg-secondary/40 flex items-center gap-3 rounded-lg px-4 py-2">
          <Sparkles className="text-primary size-5 shrink-0" />
          <span className="text-sm font-medium">
            As fotos com maior resolução aparecem primeiro automaticamente.
          </span>
        </div>
      </div>
    </div>
  );
}
