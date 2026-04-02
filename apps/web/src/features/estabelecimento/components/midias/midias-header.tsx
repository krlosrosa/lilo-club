"use client";

import { Button } from "@/components/ui/button";

export interface MidiasHeaderProps {
  onSync: () => void;
  isFetching: boolean;
}

export function MidiasHeader({ onSync, isFetching }: MidiasHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h2 className="text-primary text-3xl font-bold tracking-tight">Mídia do Estabelecimento</h2>
        <p className="text-muted-foreground mt-1 text-sm font-medium">Gerencie sua identidade visual e galeria</p>
      </div>
      <Button type="button" className="rounded-full px-8 shadow-md" onClick={onSync} disabled={isFetching}>
        Salvar alterações
      </Button>
    </div>
  );
}
