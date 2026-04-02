"use client";

import { ImagePlus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MidiaItem } from "../../types";

export interface MidiasLogoCardProps {
  logoMidia: MidiaItem | null;
  onPickLogo: () => void;
  onRemoveLogo: () => void;
}

export function MidiasLogoCard({ logoMidia, onPickLogo, onRemoveLogo }: MidiasLogoCardProps) {
  return (
    <div
      className={cn(
        "bg-card flex flex-col items-center justify-center rounded-lg border border-transparent p-8 text-center shadow-none transition-shadow duration-500",
        "hover:shadow-md",
      )}
    >
      <div className="group relative mb-6">
        <div
          className={cn(
            "border-border flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-muted/40",
            "transition-colors group-hover:border-primary",
          )}
        >
          {logoMidia?.urlPublica ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoMidia.urlPublica} alt="" className="h-full w-full object-contain p-4" />
          ) : (
            <ImagePlus className="text-muted-foreground size-10 opacity-40" aria-hidden />
          )}
        </div>
        <Button
          type="button"
          size="icon"
          className="absolute -right-2 -bottom-2 size-9 rounded-full shadow-lg"
          onClick={onPickLogo}
        >
          <Pencil className="size-4" />
        </Button>
      </div>
      <h3 className="mb-2 text-lg font-bold">Logotipo</h3>
      <p className="text-muted-foreground mb-6 max-w-xs px-2 text-sm">
        Use uma imagem quadrada de pelo menos 512×512px em formato PNG ou SVG.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          type="button"
          variant="secondary"
          className="rounded-full text-xs font-bold uppercase tracking-wider"
          onClick={onPickLogo}
        >
          Alterar
        </Button>
        {logoMidia ? (
          <Button
            type="button"
            variant="ghost"
            className="text-destructive rounded-full text-xs font-bold uppercase tracking-wider hover:bg-destructive/10"
            onClick={onRemoveLogo}
          >
            Remover
          </Button>
        ) : null}
      </div>
    </div>
  );
}
