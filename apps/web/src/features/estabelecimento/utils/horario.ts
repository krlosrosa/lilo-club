import { DAY_ORDER } from "../constants";
import type { DayState } from "../types";

export function emptyDay(): DayState {
  return { open: false, slots: [] };
}

export type HorarioIntervaloLike = {
  diaSemana: number;
  abre: string;
  fecha: string;
  ordem?: number;
};

/** Builds week editor state from API or IA interval list (sorted by dia + ordem). */
export function intervalosToByDay(intervalos: HorarioIntervaloLike[]): Record<number, DayState> {
  const next: Record<number, DayState> = {};
  for (const d of DAY_ORDER) next[d] = emptyDay();
  const sorted = [...intervalos].sort((a, b) => {
    if (a.diaSemana !== b.diaSemana) return a.diaSemana - b.diaSemana;
    return (a.ordem ?? 0) - (b.ordem ?? 0);
  });
  for (const it of sorted) {
    const cur = next[it.diaSemana] ?? emptyDay();
    cur.open = true;
    cur.slots.push({ abre: it.abre, fecha: it.fecha });
    next[it.diaSemana] = cur;
  }
  return next;
}

export function buildIntervalosPayload(byDay: Record<number, DayState>) {
  const intervalos: { diaSemana: number; ordem: number; abre: string; fecha: string }[] = [];
  for (const d of DAY_ORDER) {
    const st = byDay[d];
    if (!st?.open) continue;
    let ordem = 0;
    for (const s of st.slots) {
      intervalos.push({ diaSemana: d, ordem, abre: s.abre, fecha: s.fecha });
      ordem += 1;
    }
  }
  return intervalos;
}
