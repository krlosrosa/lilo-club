"use client";

import { queryKeys } from "@lilo-hub/clients";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRef, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { MidiasCapaCard } from "../components/midias/midias-capa-card";
import { MidiasGaleriaSection } from "../components/midias/midias-galeria-section";
import { MidiasHeader } from "../components/midias/midias-header";
import { MidiasLogoCard } from "../components/midias/midias-logo-card";
import { MidiasPromoBanner } from "../components/midias/midias-promo-banner";
import { estabelecimentoApi } from "../api";
import type { MidiaItem } from "../types";
import { pickFirstTipo } from "../utils/midias";

export function EstabelecimentoMidiasScreen() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingTipo = useRef<"logo" | "capa" | "galeria">("galeria");

  const accountQ = useQuery({
    queryKey: queryKeys.accountMe,
    queryFn: () => estabelecimentoApi.getAccountMe(),
  });

  const midiasQ = useQuery({
    queryKey: queryKeys.midias(id),
    queryFn: () => estabelecimentoApi.listEstabelecimentoMidias(id),
  });

  const uploadM = useMutation({
    mutationFn: ({ file, tipo }: { file: File; tipo: "logo" | "capa" | "galeria" }) =>
      estabelecimentoApi.uploadEstabelecimentoMidia(id, file, tipo),
    onSuccess: () => {
      toast.success("Upload concluído");
      void queryClient.invalidateQueries({ queryKey: queryKeys.midias(id) });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteM = useMutation({
    mutationFn: (midiaId: string) => estabelecimentoApi.deleteEstabelecimentoMidia(id, midiaId),
    onSuccess: () => {
      toast.success("Removido");
      void queryClient.invalidateQueries({ queryKey: queryKeys.midias(id) });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reorderM = useMutation({
    mutationFn: (ids: string[]) => estabelecimentoApi.patchEstabelecimentoMidiasOrdem(id, { idsOrdenados: ids }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.midias(id) });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const items: MidiaItem[] = midiasQ.data?.items ?? [];
  const max = accountQ.data?.maxMidiasPorEstabelecimento ?? null;

  const logoMidia = pickFirstTipo(items, "logo");
  const capaMidia = pickFirstTipo(items, "capa");
  const galeriaItems = items.filter((m) => m.tipo === "galeria");

  const canAddGaleria = max == null || items.length < max;

  function onFile(tipo: "logo" | "capa" | "galeria") {
    pendingTipo.current = tipo;
    fileRef.current?.click();
  }

  function onChangeFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    const tipo = pendingTipo.current;
    e.target.value = "";
    if (!f) return;
    uploadM.mutate({ file: f, tipo });
  }

  function reorderGaleria(galeriaIndex: number, dir: -1 | 1) {
    const j = galeriaIndex + dir;
    if (j < 0 || j >= galeriaItems.length) return;

    const gIds = galeriaItems.map((x) => x.id);
    const t = gIds[galeriaIndex]!;
    gIds[galeriaIndex] = gIds[j]!;
    gIds[j] = t;

    let gi = 0;
    const idsOrdenados = items.map((m) => (m.tipo === "galeria" ? gIds[gi++]! : m.id));
    reorderM.mutate(idsOrdenados);
  }

  function syncMidias() {
    void queryClient.invalidateQueries({ queryKey: queryKeys.midias(id) });
    void queryClient.invalidateQueries({ queryKey: queryKeys.accountMe });
    toast.message("Lista atualizada");
  }

  if (midiasQ.isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-11 w-44 rounded-full" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-80 rounded-lg md:col-span-1" />
          <Skeleton className="h-80 rounded-lg md:col-span-2" />
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onChangeFile} />

      <MidiasHeader onSync={syncMidias} isFetching={midiasQ.isFetching} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <MidiasLogoCard
          logoMidia={logoMidia}
          onPickLogo={() => onFile("logo")}
          onRemoveLogo={() => logoMidia && deleteM.mutate(logoMidia.id)}
        />
        <MidiasCapaCard
          capaMidia={capaMidia}
          onPickCapa={() => onFile("capa")}
          onRemoveCapa={() => capaMidia && deleteM.mutate(capaMidia.id)}
        />
      </div>

      <MidiasGaleriaSection
        galeriaItems={galeriaItems}
        itemsCount={items.length}
        maxMidias={max}
        canAddGaleria={canAddGaleria}
        uploadPending={uploadM.isPending}
        onPickGaleria={() => onFile("galeria")}
        onDeleteMidia={(midiaId) => deleteM.mutate(midiaId)}
        onReorderGaleria={reorderGaleria}
      />

      <MidiasPromoBanner />
    </div>
  );
}
