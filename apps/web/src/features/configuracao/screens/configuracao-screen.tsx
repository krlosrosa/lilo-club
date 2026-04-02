"use client";

import { queryKeys } from "@lilo-hub/clients";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Save } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfiguracaoDadosSection } from "../components/configuracao-dados-section";
import { ConfiguracaoProfileCard } from "../components/configuracao-profile-card";
import { configuracaoApi } from "../api";

export function ConfiguracaoScreen() {
  const queryClient = useQueryClient();
  const dadosRef = useRef<HTMLDivElement>(null);
  const q = useQuery({
    queryKey: queryKeys.authMe,
    queryFn: () => configuracaoApi.getMe(),
  });

  const [overrides, setOverrides] = useState<{
    nome?: string;
    tipo?: "cliente" | "dono" | "parceiro" | null;
  }>({});

  const saveM = useMutation({
    mutationFn: (body: { nome: string; tipo: "cliente" | "dono" | "parceiro" | null }) =>
      configuracaoApi.patchMe({
        nome: body.nome.trim() || undefined,
        tipoUsuario: body.tipo,
      }),
    onSuccess: () => {
      toast.success("Perfil atualizado");
      setOverrides({});
      void queryClient.invalidateQueries({ queryKey: queryKeys.authMe });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function salvar() {
    if (!q.data) return;
    const nomeVal = overrides.nome !== undefined ? overrides.nome : (q.data.nome ?? "");
    const tipoVal =
      overrides.tipo !== undefined ? overrides.tipo : (q.data.tipoUsuario ?? null);
    saveM.mutate({ nome: nomeVal, tipo: tipoVal });
  }

  if (q.isLoading || !q.data) {
    return (
      <div className="mx-auto max-w-4xl space-y-8 py-4">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  const me = q.data;
  const nome = overrides.nome !== undefined ? overrides.nome : (me.nome ?? "");
  const tipo = overrides.tipo !== undefined ? overrides.tipo : (me.tipoUsuario ?? null);
  const displayName = nome.trim() || me.nome || "Seu nome";

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-foreground mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Configurações de perfil
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Gerencie suas informações pessoais e credenciais de acesso ao portal.
          </p>
        </div>
        <Button type="button" className="gap-2 rounded-full px-8 shadow-md" onClick={salvar} disabled={saveM.isPending}>
          <Save className="size-4" />
          {saveM.isPending ? "Salvando…" : "Salvar alterações"}
        </Button>
      </div>

      <ConfiguracaoProfileCard
        me={me}
        displayName={displayName}
        tipo={tipo}
        setTipo={(v) => setOverrides((o) => ({ ...o, tipo: v }))}
        dadosRef={dadosRef}
      />

      <ConfiguracaoDadosSection
        dadosRef={dadosRef}
        me={me}
        nome={nome}
        setNome={(v) => setOverrides((o) => ({ ...o, nome: v }))}
      />

      <div className="border-border flex justify-end border-t pt-8">
        <Button variant="secondary" className="gap-2 rounded-full font-bold shadow-sm" asChild>
          <Link href="/estabelecimentos">
            <ExternalLink className="size-4" />
            Ver estabelecimentos
          </Link>
        </Button>
      </div>
    </div>
  );
}
