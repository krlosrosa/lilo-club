"use client";

import type { SuggestEstabelecimentoHorarioResponse } from "@lilo-hub/contracts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DAY_LABEL, DAY_ORDER } from "../../constants";

export interface EstabelecimentoHorarioIaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intervalos: SuggestEstabelecimentoHorarioResponse["intervalos"];
  onApply: () => void;
}

export function EstabelecimentoHorarioIaDialog({
  open,
  onOpenChange,
  intervalos,
  onApply,
}: EstabelecimentoHorarioIaDialogProps) {
  const byDay = new Map<number, typeof intervalos>();
  for (const it of intervalos) {
    const list = byDay.get(it.diaSemana) ?? [];
    list.push(it);
    byDay.set(it.diaSemana, list);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Horários sugeridos pela IA</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Revise os intervalos abaixo. Ao confirmar, eles substituem toda a semana no editor — use
          &quot;Publicar horários&quot; para gravar no guia.
        </p>
        <ul
          className="bg-muted/60 max-h-[min(50vh,360px)] space-y-3 overflow-y-auto rounded-lg p-3 text-sm sm:p-4"
          role="region"
          aria-label="Intervalos sugeridos"
        >
          {DAY_ORDER.map((d) => {
            const slots = byDay.get(d);
            if (!slots?.length) return null;
            return (
              <li key={d}>
                <span className="font-medium">{DAY_LABEL[d]}</span>
                <ul className="text-muted-foreground mt-1 list-inside list-disc">
                  {slots.map((s, i) => (
                    <li key={`${d}-${s.ordem}-${i}`}>
                      {s.abre} – {s.fecha}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => {
              onApply();
              onOpenChange(false);
            }}
          >
            Aplicar na grade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
