"use client";

import { queryKeys } from "@lilo-hub/clients";
import type { SuggestEstabelecimentoHorarioResponse } from "@lilo-hub/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EstabelecimentoHorarioIaDialog } from "../components/horario/estabelecimento-horario-ia-dialog";
import { EstabelecimentoHorarioIaSection } from "../components/horario/estabelecimento-horario-ia-section";
import { HorarioWeekEditor } from "../components/horario/horario-week-editor";
import { estabelecimentoApi } from "../api";
import type { DayState } from "../types";
import { buildIntervalosPayload, emptyDay, intervalosToByDay } from "../utils/horario";

export function EstabelecimentoHorarioScreen() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const q = useQuery({
    queryKey: queryKeys.horarios(id),
    queryFn: () => estabelecimentoApi.getEstabelecimentoHorarios(id),
  });

  const [byDay, setByDay] = useState<Record<number, DayState>>({});
  const [textoIa, setTextoIa] = useState("");
  const [iaDialogOpen, setIaDialogOpen] = useState(false);
  const [iaPreview, setIaPreview] = useState<SuggestEstabelecimentoHorarioResponse["intervalos"]>([]);

  useEffect(() => {
    if (!q.data) return;
    // Sync editor when horarios are fetched or invalidated after save.
    setByDay(intervalosToByDay(q.data.intervalos));
    // eslint-disable-next-line react-compiler/react-compiler -- intentional sync from React Query cache to local edit state
  }, [q.data]);

  function setOpen(d: number, open: boolean) {
    setByDay((prev) => {
      const prevDay = prev[d] ?? emptyDay();
      const slots = open
        ? prevDay.slots.length > 0
          ? prevDay.slots
          : [{ abre: "09:00", fecha: "18:00" }]
        : [];
      return { ...prev, [d]: { open, slots } };
    });
  }

  function addSlot(d: number) {
    setByDay((prev) => {
      const cur = { ...(prev[d] ?? emptyDay()) };
      cur.slots = [...cur.slots, { abre: "09:00", fecha: "12:00" }];
      return { ...prev, [d]: cur };
    });
  }

  function updateSlot(d: number, i: number, key: "abre" | "fecha", v: string) {
    setByDay((prev) => {
      const cur = { ...(prev[d] ?? emptyDay()) };
      const slots = [...cur.slots];
      slots[i] = { ...slots[i], [key]: v };
      cur.slots = slots;
      return { ...prev, [d]: cur };
    });
  }

  function removeSlot(d: number, i: number) {
    setByDay((prev) => {
      const cur = { ...(prev[d] ?? emptyDay()) };
      cur.slots = cur.slots.filter((_, j) => j !== i);
      if (cur.slots.length === 0) cur.open = false;
      return { ...prev, [d]: cur };
    });
  }

  const suggestHorarioM = useMutation({
    mutationFn: () =>
      estabelecimentoApi.postSuggestEstabelecimentoHorario(id, { texto: textoIa.trim() }),
    onSuccess: (data) => {
      setIaPreview(data.intervalos);
      setIaDialogOpen(true);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveM = useMutation({
    mutationFn: () =>
      estabelecimentoApi.putEstabelecimentoHorarios(id, {
        intervalos: buildIntervalosPayload(byDay),
      }),
    onSuccess: () => {
      toast.success("Horários publicados");
      void queryClient.invalidateQueries({ queryKey: queryKeys.horarios(id) });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (q.isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <EstabelecimentoHorarioIaSection
        texto={textoIa}
        onTextoChange={setTextoIa}
        onInterpretar={() => suggestHorarioM.mutate()}
        isPending={suggestHorarioM.isPending}
      />
      <EstabelecimentoHorarioIaDialog
        open={iaDialogOpen}
        onOpenChange={setIaDialogOpen}
        intervalos={iaPreview}
        onApply={() => setByDay(intervalosToByDay(iaPreview))}
      />
      <HorarioWeekEditor
        byDay={byDay}
        setOpen={setOpen}
        addSlot={addSlot}
        updateSlot={updateSlot}
        removeSlot={removeSlot}
      />
      <div className="flex justify-end">
        <Button onClick={() => saveM.mutate()} disabled={saveM.isPending}>
          {saveM.isPending ? "Publicando…" : "Publicar horários"}
        </Button>
      </div>
    </div>
  );
}
