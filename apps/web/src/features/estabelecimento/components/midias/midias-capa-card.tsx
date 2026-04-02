"use client";

import { Info, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MidiaItem } from "../../types";

export interface MidiasCapaCardProps {
  capaMidia: MidiaItem | null;
  onPickCapa: () => void;
  onRemoveCapa: () => void;
}

export function MidiasCapaCard({ capaMidia, onPickCapa, onRemoveCapa }: MidiasCapaCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-lg border border-transparent p-8 shadow-none transition-shadow duration-500 md:col-span-2",
        "hover:shadow-md",
      )}
    >
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold">Capa principal</h3>
        <span className="bg-muted text-muted-foreground w-fit rounded-full px-3 py-1 text-xs">
          Recomendado: 1920×1080px
        </span>
      </div>
      <div
        className={cn(
          "group border-border bg-muted/30 relative aspect-21/9 w-full overflow-hidden rounded-xl border-2 border-dashed",
          "transition-colors hover:border-primary",
        )}
      >
        {capaMidia?.urlPublica ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={capaMidia.urlPublica} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="rounded-full text-xs font-bold"
                onClick={onPickCapa}
              >
                <Upload className="size-3.5" />
                Substituir
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="rounded-full text-xs font-bold"
                onClick={onRemoveCapa}
              >
                <Trash2 className="size-3.5" />
                Remover
              </Button>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
            <div className="text-muted-foreground flex flex-col items-center gap-2 text-sm">
              <Upload className="size-8 opacity-50" />
              <span className="font-medium">Nenhuma capa definida</span>
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="rounded-full text-xs font-bold"
              onClick={onPickCapa}
            >
              <Upload className="size-3.5" />
              Enviar capa
            </Button>
          </div>
        )}
      </div>
      <div className="text-muted-foreground mt-6 flex items-start gap-3">
        <Info className="text-primary mt-0.5 size-4 shrink-0" />
        <p className="text-sm italic">Esta imagem será o primeiro contato visual do seu cliente no portal público.</p>
      </div>
    </div>
  );
}
