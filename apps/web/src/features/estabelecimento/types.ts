import type { ListEstabelecimentoMidiasResponse } from "@lilo-hub/contracts";

export type EnderecoFields = {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  latitude: number;
  longitude: number;
};

export interface CategoriaOption {
  id: string;
  nome: string;
}

export type DayState = { open: boolean; slots: { abre: string; fecha: string }[] };

export type MidiaItem = ListEstabelecimentoMidiasResponse["items"][number];
