"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { DAY_LABEL, DAY_ORDER } from "../../constants";
import type { DayState } from "../../types";
import { emptyDay } from "../../utils/horario";

export interface HorarioWeekEditorProps {
  byDay: Record<number, DayState>;
  setOpen: (d: number, open: boolean) => void;
  addSlot: (d: number) => void;
  updateSlot: (d: number, i: number, key: "abre" | "fecha", v: string) => void;
  removeSlot: (d: number, i: number) => void;
}

export function HorarioWeekEditor({
  byDay,
  setOpen,
  addSlot,
  updateSlot,
  removeSlot,
}: HorarioWeekEditorProps) {
  const displayDays = DAY_ORDER.map((d) => ({ d, label: DAY_LABEL[d] }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horários de funcionamento</CardTitle>
        <CardDescription>
          Defina intervalos por dia. O botão &quot;Gerenciar exceções&quot; virá em breve.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button type="button" variant="outline" size="sm" disabled>
          Gerenciar exceções (em breve)
        </Button>
        {displayDays.map(({ d, label }) => {
          const st = byDay[d] ?? emptyDay();
          return (
            <div
              key={d}
              className="border-border flex flex-col gap-2 rounded-lg border p-4 md:flex-row md:items-start"
            >
              <div className="md:w-44">
                <p className="font-medium">{label}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Switch checked={st.open} onCheckedChange={(v) => setOpen(d, v)} />
                  <span className="text-muted-foreground text-sm">{st.open ? "Aberto" : "Fechado"}</span>
                </div>
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                {st.open ? (
                  <>
                    {st.slots.map((s, i) => (
                      <div key={i} className="flex flex-wrap items-center gap-2">
                        <input
                          type="time"
                          className="border-input rounded border px-2 py-1 text-sm"
                          value={s.abre}
                          onChange={(e) => updateSlot(d, i, "abre", e.target.value)}
                        />
                        <span className="text-muted-foreground">—</span>
                        <input
                          type="time"
                          className="border-input rounded border px-2 py-1 text-sm"
                          value={s.fecha}
                          onChange={(e) => updateSlot(d, i, "fecha", e.target.value)}
                        />
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeSlot(d, i)}>
                          Remover
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="secondary" size="sm" onClick={() => addSlot(d)}>
                      Adicionar intervalo
                    </Button>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">Fechado</p>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
