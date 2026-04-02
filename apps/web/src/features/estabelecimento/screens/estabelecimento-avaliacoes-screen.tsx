"use client";

import { queryKeys } from "@lilo-hub/clients";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { AvaliacaoReviewCard } from "../components/avaliacoes/avaliacao-review-card";
import { AvaliacoesFiltersBar } from "../components/avaliacoes/avaliacoes-filters-bar";
import type { AvaliacoesTab } from "../components/avaliacoes/avaliacoes-intro-tabs";
import { AvaliacoesIntroTabs } from "../components/avaliacoes/avaliacoes-intro-tabs";
import { AvaliacoesPaginationFooter } from "../components/avaliacoes/avaliacoes-pagination-footer";
import { AvaliacoesReplyDialog } from "../components/avaliacoes/avaliacoes-reply-dialog";
import { AvaliacoesStatsGrid } from "../components/avaliacoes/avaliacoes-stats-grid";
import { estabelecimentoApi } from "../api";
import { AVALIACOES_PAGE_SIZE, AVALIACOES_STATS_SAMPLE } from "../constants";
import { avgStarsFromItems, isToday, type AvaliacaoItem } from "../utils/avaliacoes";

export function EstabelecimentoAvaliacoesScreen() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [tab, setTab] = useState<AvaliacoesTab>("geral");
  const [notaFiltro, setNotaFiltro] = useState<string>("todas");
  const [ordem, setOrdem] = useState<string>("recentes");
  const [semResposta, setSemResposta] = useState(false);
  const [search, setSearch] = useState("");

  const [replyOpen, setReplyOpen] = useState(false);
  const [activeAvaliacao, setActiveAvaliacao] = useState<AvaliacaoItem | null>(null);
  const [replyText, setReplyText] = useState("");

  const estQ = useQuery({
    queryKey: queryKeys.estabelecimento(id),
    queryFn: () => estabelecimentoApi.getEstabelecimento(id),
  });

  const statsQ = useQuery({
    queryKey: queryKeys.avaliacoes(id, 0, AVALIACOES_STATS_SAMPLE),
    queryFn: () => estabelecimentoApi.listEstabelecimentoAvaliacoes(id, 0, AVALIACOES_STATS_SAMPLE),
  });

  const listQ = useQuery({
    queryKey: queryKeys.avaliacoes(id, page, AVALIACOES_PAGE_SIZE),
    queryFn: () => estabelecimentoApi.listEstabelecimentoAvaliacoes(id, page, AVALIACOES_PAGE_SIZE),
  });

  const replyM = useMutation({
    mutationFn: ({ avaliacaoId, resposta }: { avaliacaoId: string; resposta: string }) =>
      estabelecimentoApi.patchEstabelecimentoAvaliacao(id, avaliacaoId, { resposta }),
    onSuccess: () => {
      toast.success(activeAvaliacao?.resposta ? "Resposta atualizada" : "Resposta enviada");
      setReplyOpen(false);
      setActiveAvaliacao(null);
      void queryClient.invalidateQueries({
        predicate: (qry) =>
          Array.isArray(qry.queryKey) &&
          qry.queryKey[0] === "estabelecimento" &&
          qry.queryKey[1] === id &&
          qry.queryKey[2] === "avaliacoes",
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.estabelecimento(id) });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const total = listQ.data?.total ?? statsQ.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / AVALIACOES_PAGE_SIZE));

  const stats = useMemo(() => {
    const sampleItems = statsQ.data?.items ?? [];
    const notaMedia =
      estQ.data?.scoreMedio ?? (sampleItems.length ? avgStarsFromItems(sampleItems) : null);
    const totalAval = statsQ.data?.total ?? 0;
    let taxaResposta: number | null = null;
    if (sampleItems.length > 0) {
      const responded = sampleItems.filter((x) => x.resposta?.trim()).length;
      taxaResposta = Math.round((responded / sampleItems.length) * 100);
    }
    const novasHoje = sampleItems.filter((x) => isToday(x.createdAt)).length;
    return { notaMedia, totalAval, taxaResposta, novasHoje, sampleLen: sampleItems.length };
  }, [estQ.data?.scoreMedio, statsQ.data]);

  const filteredItems = useMemo(() => {
    const rawItems = listQ.data?.items ?? [];
    let xs = [...rawItems];
    if (notaFiltro === "5") xs = xs.filter((a) => a.nota === 5);
    else if (notaFiltro === "4") xs = xs.filter((a) => a.nota === 4);
    else if (notaFiltro === "3") xs = xs.filter((a) => a.nota === 3);
    else if (notaFiltro === "baixas") xs = xs.filter((a) => a.nota <= 2);
    if (semResposta) xs = xs.filter((a) => !a.resposta?.trim());
    const qv = search.trim().toLowerCase();
    if (qv) xs = xs.filter((a) => a.comentario?.toLowerCase().includes(qv));
    if (ordem === "antigas") xs.sort((a, b) => a.createdAt - b.createdAt);
    else if (ordem === "relevantes") xs.sort((a, b) => b.utilCount - a.utilCount);
    else xs.sort((a, b) => b.createdAt - a.createdAt);
    return xs;
  }, [listQ.data?.items, notaFiltro, ordem, search, semResposta]);

  function openReply(a: AvaliacaoItem) {
    setActiveAvaliacao(a);
    setReplyText(a.resposta?.trim() ?? "");
    setReplyOpen(true);
  }

  const loading = listQ.isLoading || estQ.isLoading;

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-14 w-2/3" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      <section>
        <AvaliacoesIntroTabs tab={tab} onTabChange={setTab} />
        <AvaliacoesStatsGrid
          notaMedia={stats.notaMedia}
          totalAval={stats.totalAval}
          taxaResposta={stats.taxaResposta}
          sampleLen={stats.sampleLen}
          totalFromList={total}
          novasHoje={stats.novasHoje}
        />
      </section>

      <AvaliacoesFiltersBar
        notaFiltro={notaFiltro}
        setNotaFiltro={setNotaFiltro}
        ordem={ordem}
        setOrdem={setOrdem}
        semResposta={semResposta}
        toggleSemResposta={() => setSemResposta((s) => !s)}
        search={search}
        setSearch={setSearch}
        resetPage={() => setPage(0)}
      />

      <div className="space-y-6">
        {filteredItems.length === 0 ? (
          <div className="bg-card text-muted-foreground rounded-xl border p-10 text-center text-sm shadow-sm">
            {(listQ.data?.items ?? []).length === 0
              ? "Nenhuma avaliação ainda."
              : "Nenhum resultado com esses filtros nesta página."}
          </div>
        ) : (
          filteredItems.map((a) => <AvaliacaoReviewCard key={a.id} avaliacao={a} onOpenReply={openReply} />)
        )}
      </div>

      <AvaliacoesPaginationFooter
        page={page}
        total={total}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(0, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />

      <AvaliacoesReplyDialog
        open={replyOpen}
        onOpenChange={(open) => {
          setReplyOpen(open);
          if (!open) setActiveAvaliacao(null);
        }}
        activeAvaliacao={activeAvaliacao}
        replyText={replyText}
        setReplyText={setReplyText}
        isPending={replyM.isPending}
        onSubmit={() => {
          if (!activeAvaliacao || !replyText.trim()) return;
          replyM.mutate({ avaliacaoId: activeAvaliacao.id, resposta: replyText.trim() });
        }}
      />
    </div>
  );
}
