"use client";

import { queryKeys } from "@lilo-hub/clients";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EstabelecimentoGeralEditor } from "../components/geral/estabelecimento-geral-editor";
import { estabelecimentoApi } from "../api";

export function EstabelecimentoGeralScreen() {
  const params = useParams();
  const id = params.id as string;

  const q = useQuery({
    queryKey: queryKeys.estabelecimento(id),
    queryFn: () => estabelecimentoApi.getEstabelecimento(id),
  });

  const midiasQ = useQuery({
    queryKey: queryKeys.midias(id),
    queryFn: () => estabelecimentoApi.listEstabelecimentoMidias(id),
  });

  const catQ = useQuery({
    queryKey: queryKeys.catalogCategorias,
    queryFn: () => estabelecimentoApi.getCatalogCategorias(),
  });

  const capaUrl = useMemo(() => {
    const items = midiasQ.data?.items ?? [];
    return items.find((m) => m.tipo === "capa")?.urlPublica ?? null;
  }, [midiasQ.data?.items]);

  const logoUrl = useMemo(() => {
    const items = midiasQ.data?.items ?? [];
    return items.find((m) => m.tipo === "logo")?.urlPublica ?? null;
  }, [midiasQ.data?.items]);

  if (q.isLoading) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }
  if (q.isError || !q.data) {
    return <p className="text-destructive text-sm">Não encontrado.</p>;
  }

  return (
    <EstabelecimentoGeralEditor
      key={`${id}-${q.data.updatedAt}`}
      estabelecimentoId={id}
      initial={q.data}
      capaUrl={capaUrl}
      logoUrl={logoUrl}
      categorias={catQ.data?.items ?? []}
    />
  );
}
