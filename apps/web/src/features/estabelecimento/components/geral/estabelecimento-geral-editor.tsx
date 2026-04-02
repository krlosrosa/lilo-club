"use client";

import { queryKeys } from "@lilo-hub/clients";
import type { EstabelecimentoDetail } from "@lilo-hub/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { estabelecimentoApi } from "../../api";
import type { CategoriaOption } from "../../types";
import { EstabelecimentoDescricaoIaDialog } from "./estabelecimento-descricao-ia-dialog";
import { EstabelecimentoGeralFormColumn } from "./estabelecimento-geral-form-column";
import { EstabelecimentoGeralHero } from "./estabelecimento-geral-hero";
import { EstabelecimentoGeralSidebar } from "./estabelecimento-geral-sidebar";
import { EstabelecimentoGeralTrustFooter } from "./estabelecimento-geral-trust-footer";

export interface EstabelecimentoGeralEditorProps {
  estabelecimentoId: string;
  initial: EstabelecimentoDetail;
  capaUrl: string | null;
  logoUrl: string | null;
  categorias: CategoriaOption[];
}

export function EstabelecimentoGeralEditor({
  estabelecimentoId,
  initial,
  capaUrl,
  logoUrl,
  categorias,
}: EstabelecimentoGeralEditorProps) {
  const queryClient = useQueryClient();
  const [nome, setNome] = useState(initial.nome);
  const [descricao, setDescricao] = useState(initial.descricao ?? "");
  const [conteudoSemantico, setConteudoSemantico] = useState(initial.conteudoSemantico ?? "");
  const [pesoDestaque, setPesoDestaque] = useState(initial.pesoDestaque);
  const [categoriaId, setCategoriaId] = useState(initial.categoriaId);
  const [publicado, setPublicado] = useState(initial.publicado);
  const [destaque, setDestaque] = useState(initial.destaque);
  const [descricaoIaOpen, setDescricaoIaOpen] = useState(false);
  const [descricaoSugeridaPreview, setDescricaoSugeridaPreview] = useState("");

  const scoreText = initial.scoreMedio != null ? initial.scoreMedio.toFixed(1) : "—";

  const suggestDescricaoM = useMutation({
    mutationFn: () =>
      estabelecimentoApi.postSuggestEstabelecimentoDescricao(estabelecimentoId, {
        rascunho: descricao,
      }),
    onSuccess: (data) => {
      setDescricaoSugeridaPreview(data.descricaoSugerida);
      setDescricaoIaOpen(true);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveM = useMutation({
    mutationFn: () =>
      estabelecimentoApi.patchEstabelecimento(estabelecimentoId, {
        nome,
        descricao: descricao || null,
        conteudoSemantico: conteudoSemantico || null,
        pesoDestaque,
        categoriaId,
        publicado,
        destaque,
      }),
    onSuccess: () => {
      toast.success("Salvo");
      void queryClient.invalidateQueries({ queryKey: queryKeys.estabelecimento(estabelecimentoId) });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <EstabelecimentoGeralHero
        nome={nome}
        initialNome={initial.nome}
        destaque={destaque}
        categoriaId={categoriaId}
        categorias={categorias}
        categoriaNomeFallback={initial.categoriaNome}
        capaUrl={capaUrl}
        logoUrl={logoUrl}
        scoreText={scoreText}
        totalAvaliacoes={initial.totalAvaliacoes}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <EstabelecimentoGeralFormColumn
          nome={nome}
          setNome={setNome}
          descricao={descricao}
          setDescricao={setDescricao}
          conteudoSemantico={conteudoSemantico}
          setSemantico={setConteudoSemantico}
          pesoDestaque={pesoDestaque}
          setPesoDestaque={setPesoDestaque}
          categoriaId={categoriaId}
          setCategoriaId={setCategoriaId}
          categorias={categorias}
          onSave={() => saveM.mutate()}
          isSaving={saveM.isPending}
          onSuggestDescricao={() => suggestDescricaoM.mutate()}
          isSuggestingDescricao={suggestDescricaoM.isPending}
        />

        <EstabelecimentoGeralSidebar
          publicado={publicado}
          setPublicado={setPublicado}
          destaque={destaque}
          setDestaque={setDestaque}
        />
      </div>

      <EstabelecimentoGeralTrustFooter />

      <EstabelecimentoDescricaoIaDialog
        open={descricaoIaOpen}
        onOpenChange={setDescricaoIaOpen}
        suggestedText={descricaoSugeridaPreview}
        onApply={() => setDescricao(descricaoSugeridaPreview)}
      />
    </div>
  );
}
