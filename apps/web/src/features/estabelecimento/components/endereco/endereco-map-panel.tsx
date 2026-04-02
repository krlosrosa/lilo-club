"use client";

import dynamic from "next/dynamic";
import { BadgeCheck, Navigation, Pencil } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { EnderecoFields } from "../../types";

const AddressMap = dynamic(
  () => import("../address-map").then((m) => m.AddressMap),
  { ssr: false, loading: () => <Skeleton className="h-[min(500px,70vh)] min-h-[320px] w-full rounded-lg" /> },
);

export interface EnderecoMapPanelProps {
  f: EnderecoFields;
  nomeEst: string;
  localVerificado?: boolean | null;
  setCoord: (la: number, ln: number) => void;
}

export function EnderecoMapPanel({ f, nomeEst, localVerificado, setCoord }: EnderecoMapPanelProps) {
  const mapWrapRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={mapWrapRef}
      className="relative isolate h-full min-h-[min(500px,70vh)] overflow-hidden rounded-lg bg-muted shadow-sm"
    >
      <div className="absolute inset-0 z-0">
        <AddressMap
          latitude={f.latitude}
          longitude={f.longitude}
          onDragEnd={setCoord}
          className="min-h-[min(500px,70vh)] rounded-lg"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 z-5 bg-linear-to-t from-black/35 via-transparent to-transparent" />

      <div className="pointer-events-none absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center">
        <div className="supports-backdrop-filter:bg-background/85 border-background/20 bg-background/90 rounded-lg border px-4 py-2 text-center shadow-lg backdrop-blur-sm">
          <span className="text-primary text-sm font-bold">{nomeEst}</span>
          {localVerificado ? (
            <div className="text-muted-foreground mt-0.5 flex items-center justify-center gap-1 text-[10px] font-bold tracking-wide uppercase">
              <BadgeCheck className="text-primary size-3.5" />
              Local verificado
            </div>
          ) : null}
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 z-10 p-4 sm:p-6">
        <div className="supports-backdrop-filter:bg-background/85 border-border/40 flex flex-col gap-4 rounded-xl border bg-background/80 p-4 shadow-lg backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
              <Navigation className="size-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-[10px] font-bold tracking-tight uppercase">
                Coordenadas atuais
              </p>
              <p className="text-foreground text-sm font-medium">
                {f.latitude.toFixed(5)}, {f.longitude.toFixed(5)}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="pointer-events-auto gap-2 font-bold"
            onClick={() => {
              mapWrapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
              toast.message("Arraste o marcador ou toque no mapa para ajustar a posição.");
            }}
          >
            <Pencil className="size-4" />
            Ajustar manualmente
          </Button>
        </div>
      </div>
    </div>
  );
}
