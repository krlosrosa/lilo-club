import type { ListEstabelecimentoAvaliacoesResponse } from "@lilo-hub/contracts";

export type AvaliacaoItem = ListEstabelecimentoAvaliacoesResponse["items"][number];

export function isToday(ts: number) {
  const d = new Date(ts);
  const n = new Date();
  return (
    d.getDate() === n.getDate() &&
    d.getMonth() === n.getMonth() &&
    d.getFullYear() === n.getFullYear()
  );
}

export function formatReviewDate(ts: number) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(ts));
}

export function avgStarsFromItems(items: AvaliacaoItem[]) {
  if (!items.length) return null;
  const s = items.reduce((a, x) => a + x.nota, 0) / items.length;
  return Math.round(s * 10) / 10;
}

export function clienteLabel(a: AvaliacaoItem) {
  return `Cliente ${a.id.slice(0, 8)}`;
}
