import type { MidiaItem } from "../types";

export function pickFirstTipo(items: MidiaItem[], tipo: MidiaItem["tipo"]) {
  return items.find((m) => m.tipo === tipo) ?? null;
}
