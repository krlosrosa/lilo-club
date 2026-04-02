import { DEFAULT_LAT, DEFAULT_LNG } from "../constants";
import type { EnderecoFields } from "../types";

export function mergeEndereco(
  base: EnderecoFields | undefined,
  overrides: Partial<EnderecoFields>,
): EnderecoFields {
  const b = base ?? {
    cep: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    uf: "SP",
    latitude: DEFAULT_LAT,
    longitude: DEFAULT_LNG,
  };
  return { ...b, ...overrides };
}

export function formatAtualizadoEndereco(ts: number | null | undefined) {
  if (ts == null) return null;
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(ts));
  } catch {
    return null;
  }
}

export async function fetchViaCep(digits: string): Promise<{
  ok: boolean;
  data?: Partial<Pick<EnderecoFields, "logradouro" | "bairro" | "cidade" | "uf">>;
}> {
  const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
  const raw: {
    erro?: boolean;
    logradouro?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
  } = await res.json();
  if (raw.erro) return { ok: false };
  return {
    ok: true,
    data: {
      logradouro: raw.logradouro,
      bairro: raw.bairro,
      cidade: raw.localidade,
      uf: raw.uf,
    },
  };
}
