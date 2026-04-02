"use client";

import { queryKeys } from "@lilo-hub/clients";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { EnderecoFormCard } from "../components/endereco/endereco-form-card";
import { EnderecoMapPanel } from "../components/endereco/endereco-map-panel";
import { EnderecoStatusFooter } from "../components/endereco/endereco-status-footer";
import { estabelecimentoApi } from "../api";
import { DEFAULT_LAT, DEFAULT_LNG } from "../constants";
import type { EnderecoFields } from "../types";
import { fetchViaCep, formatAtualizadoEndereco, mergeEndereco } from "../utils/endereco";

export function EstabelecimentoEnderecoScreen() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const estQ = useQuery({
    queryKey: queryKeys.estabelecimento(id),
    queryFn: () => estabelecimentoApi.getEstabelecimento(id),
  });

  const q = useQuery({
    queryKey: queryKeys.endereco(id),
    queryFn: () => estabelecimentoApi.getEstabelecimentoEndereco(id),
  });

  const [overrides, setOverrides] = useState<Partial<EnderecoFields>>({});

  const baseFields = useMemo((): EnderecoFields | undefined => {
    const e = q.data;
    if (!e) return undefined;
    return {
      cep: e.cep ?? "",
      logradouro: e.logradouro ?? "",
      bairro: e.bairro ?? "",
      cidade: e.cidade ?? "",
      uf: e.uf ?? "SP",
      latitude: e.latitude ?? DEFAULT_LAT,
      longitude: e.longitude ?? DEFAULT_LNG,
    };
  }, [q.data]);

  const f = mergeEndereco(baseFields, overrides);

  const setCoord = useCallback((la: number, ln: number) => {
    setOverrides((o) => ({ ...o, latitude: la, longitude: ln }));
  }, []);

  async function buscarCep() {
    const digits = f.cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      toast.error("CEP inválido");
      return;
    }
    try {
      const r = await fetchViaCep(digits);
      const data = r.data;
      if (!r.ok || !data) {
        toast.error("CEP não encontrado");
        return;
      }
      setOverrides((o) => ({
        ...o,
        logradouro: data.logradouro ?? o.logradouro ?? "",
        bairro: data.bairro ?? o.bairro ?? "",
        cidade: data.cidade ?? o.cidade ?? "",
        uf: data.uf ?? o.uf ?? "SP",
      }));
      toast.success("Endereço preenchido pelo CEP");
    } catch {
      toast.error("Falha ao consultar CEP");
    }
  }

  const saveM = useMutation({
    mutationFn: () =>
      estabelecimentoApi.patchEstabelecimentoEndereco(id, {
        cep: f.cep || null,
        logradouro: f.logradouro || null,
        bairro: f.bairro || null,
        cidade: f.cidade || null,
        uf: f.uf || null,
        latitude: f.latitude,
        longitude: f.longitude,
        localVerificado: true,
      }),
    onSuccess: () => {
      toast.success("Localização atualizada");
      setOverrides({});
      void queryClient.invalidateQueries({ queryKey: queryKeys.endereco(id) });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (q.isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-2/3 max-w-lg" />
        <div className="grid gap-6 lg:grid-cols-12">
          <Skeleton className="h-96 rounded-lg lg:col-span-5" />
          <Skeleton className="min-h-[500px] rounded-lg lg:col-span-7" />
        </div>
      </div>
    );
  }

  const nomeEst = estQ.data?.nome ?? "Estabelecimento";
  const atualizadoTxt = formatAtualizadoEndereco(q.data?.atualizadoEm);

  return (
    <div className="space-y-10 pb-10">
      <header className="mb-2">
        <h1 className="text-foreground mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Endereço &amp; localização
        </h1>
        <p className="text-muted-foreground max-w-2xl text-base">
          Mantenha os dados de localização do seu negócio sempre atualizados para facilitar que novos
          clientes encontrem você.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <EnderecoFormCard f={f} setOverrides={setOverrides} onBuscarCep={buscarCep} saveM={saveM} />
        </div>

        <div className="lg:col-span-7">
          <EnderecoMapPanel
            f={f}
            nomeEst={nomeEst}
            localVerificado={q.data?.localVerificado}
            setCoord={setCoord}
          />
        </div>
      </div>

      <EnderecoStatusFooter
        estabelecimentoId={id}
        atualizadoTxt={atualizadoTxt}
        onDescartar={() => setOverrides({})}
      />
    </div>
  );
}
