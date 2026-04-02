import type { EstabelecimentoStatus, MidiaTipo } from '../model/guia.enums.js';
import type {
  EstabelecimentoAvaliacaoRecord,
  EstabelecimentoEnderecoRecord,
  EstabelecimentoHorarioIntervaloRecord,
  EstabelecimentoMidiaRecord,
  EstabelecimentoRecord,
} from '../model/estabelecimento.model.js';

export const ESTABELECIMENTO_REPOSITORY = 'IEstabelecimentoRepository';

export type EstabelecimentoListEntry = {
  record: EstabelecimentoRecord;
  categoriaNome: string;
};

export type CreateEstabelecimentoInput = {
  accountId: string;
  cidadeId: string;
  categoriaId: string;
  nome: string;
  createdByUserId: string | null;
};

export type PatchEstabelecimentoInput = {
  nome?: string;
  descricao?: string | null;
  conteudoSemantico?: string | null;
  pesoDestaque?: number;
  categoriaId?: string;
  publicado?: boolean;
  destaque?: boolean;
  status?: EstabelecimentoStatus;
};

export type UpsertEnderecoInput = {
  cep?: string | null;
  logradouro?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  localVerificado?: boolean;
};

export type HorarioIntervaloInput = {
  diaSemana: number;
  ordem: number;
  abre: string;
  fecha: string;
};

export interface EstabelecimentoRepository {
  countByAccount(accountId: string): Promise<number>;
  listByAccount(accountId: string, search?: string): Promise<EstabelecimentoListEntry[]>;
  findByIdAndAccount(id: string, accountId: string): Promise<EstabelecimentoRecord | null>;
  create(input: CreateEstabelecimentoInput): Promise<EstabelecimentoRecord>;
  update(
    id: string,
    accountId: string,
    patch: PatchEstabelecimentoInput,
  ): Promise<EstabelecimentoRecord | null>;
  findCategoriaNome(categoriaId: string): Promise<string | null>;
  findEndereco(
    estabelecimentoId: string,
    accountId: string,
  ): Promise<EstabelecimentoEnderecoRecord | null>;
  upsertEndereco(
    estabelecimentoId: string,
    accountId: string,
    input: UpsertEnderecoInput,
  ): Promise<EstabelecimentoEnderecoRecord | null>;
  listHorarios(
    estabelecimentoId: string,
    accountId: string,
  ): Promise<EstabelecimentoHorarioIntervaloRecord[]>;
  replaceHorarios(
    estabelecimentoId: string,
    accountId: string,
    intervalos: HorarioIntervaloInput[],
  ): Promise<boolean>;
  listMidias(
    estabelecimentoId: string,
    accountId: string,
  ): Promise<EstabelecimentoMidiaRecord[]>;
  insertMidia(params: {
    estabelecimentoId: string;
    tipo: MidiaTipo;
    storageKey: string;
    urlPublica: string | null;
    ordem: number;
  }): Promise<EstabelecimentoMidiaRecord>;
  countMidias(estabelecimentoId: string, accountId: string): Promise<number>;
  deleteMidia(midiaId: string, accountId: string): Promise<{ storageKey: string } | null>;
  reorderMidias(
    estabelecimentoId: string,
    accountId: string,
    idsOrdenados: string[],
  ): Promise<boolean>;
  listAvaliacoes(
    estabelecimentoId: string,
    accountId: string,
    page: number,
    pageSize: number,
  ): Promise<{ items: EstabelecimentoAvaliacaoRecord[]; total: number }>;
  findAvaliacaoById(
    estabelecimentoId: string,
    accountId: string,
    avaliacaoId: string,
  ): Promise<EstabelecimentoAvaliacaoRecord | null>;
  updateAvaliacaoResposta(
    avaliacaoId: string,
    estabelecimentoId: string,
    accountId: string,
    resposta: string,
  ): Promise<EstabelecimentoAvaliacaoRecord | null>;
}
