"use client";

import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface EstabelecimentoHorarioIaSectionProps {
  texto: string;
  onTextoChange: (v: string) => void;
  onInterpretar: () => void;
  isPending: boolean;
}

export function EstabelecimentoHorarioIaSection({
  texto,
  onTextoChange,
  onInterpretar,
  isPending,
}: EstabelecimentoHorarioIaSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Descrever horários em texto</CardTitle>
        <CardDescription>
          Ex.: segunda a quinta das 8h às 18h, sexta até 17h — a IA preenche a grade abaixo. Depois
          confira e publique.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <textarea
          value={texto}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onTextoChange(e.target.value)}
          placeholder="Segunda a quinta de 08:00 às 18:00, sexta 08:00 às 17:00..."
          className="focus:ring-primary/20 min-h-[100px] w-full resize-y rounded-lg border-0 bg-muted/60 p-3 text-sm shadow-none focus:outline-none focus:ring-2 disabled:opacity-50 sm:p-4"
          disabled={isPending}
          aria-label="Descrição dos horários em linguagem natural"
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={onInterpretar} disabled={isPending || texto.trim() === ""}>
            {isPending ? "Interpretando…" : "Interpretar com IA"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
