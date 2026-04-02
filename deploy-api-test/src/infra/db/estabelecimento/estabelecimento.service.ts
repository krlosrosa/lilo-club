import { Inject, Injectable } from '@nestjs/common';
import type { EstabelecimentoRepository } from '../../../domain/repositories/estabelecimento.repository.js';
import type {
  CreateEstabelecimentoInput,
  EstabelecimentoListEntry,
  HorarioIntervaloInput,
  PatchEstabelecimentoInput,
  UpsertEnderecoInput,
} from '../../../domain/repositories/estabelecimento.repository.js';
import { DRIZZLE_PROVIDER } from '../providers/drizzle/drizzle.constants.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { countEstabelecimentosByAccountDb } from './count-estabelecimentos-by-account.drizzle.js';
import { countMidiasForAccountDb } from './count-midias.drizzle.js';
import { deleteMidiaForAccountDb } from './delete-midia.drizzle.js';
import { findCategoriaNomeDb } from './find-categoria-nome.drizzle.js';
import { findEnderecoForAccountDb } from './find-endereco-for-account.drizzle.js';
import { findAvaliacaoByIdForAccountDb } from './find-avaliacao-by-id.drizzle.js';
import { findEstabelecimentoByIdAndAccountDb } from './find-estabelecimento-by-id-and-account.drizzle.js';
import { insertEstabelecimentoDb } from './insert-estabelecimento.drizzle.js';
import { insertMidiaDb } from './insert-midia.drizzle.js';
import { listAvaliacoesForAccountDb } from './list-avaliacoes.drizzle.js';
import { listEstabelecimentosByAccountDb } from './list-estabelecimentos-by-account.drizzle.js';
import { listHorariosForAccountDb } from './list-horarios.drizzle.js';
import { listMidiasForAccountDb } from './list-midias.drizzle.js';
import { replaceHorariosForAccountDb } from './replace-horarios.drizzle.js';
import { reorderMidiasForAccountDb } from './reorder-midias.drizzle.js';
import { updateAvaliacaoRespostaDb } from './update-avaliacao-resposta.drizzle.js';
import { updateEstabelecimentoDb } from './update-estabelecimento.drizzle.js';
import { upsertEnderecoForAccountDb } from './upsert-endereco.drizzle.js';

@Injectable()
export class EstabelecimentoRepositoryService implements EstabelecimentoRepository {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  countByAccount(accountId: string): Promise<number> {
    return countEstabelecimentosByAccountDb(this.db, accountId);
  }

  listByAccount(accountId: string, search?: string): Promise<EstabelecimentoListEntry[]> {
    return listEstabelecimentosByAccountDb(this.db, accountId, search);
  }

  findByIdAndAccount(id: string, accountId: string) {
    return findEstabelecimentoByIdAndAccountDb(this.db, id, accountId);
  }

  create(input: CreateEstabelecimentoInput) {
    return insertEstabelecimentoDb(this.db, input);
  }

  update(id: string, accountId: string, patch: PatchEstabelecimentoInput) {
    return updateEstabelecimentoDb(this.db, id, accountId, patch);
  }

  findCategoriaNome(categoriaId: string): Promise<string | null> {
    return findCategoriaNomeDb(this.db, categoriaId);
  }

  findEndereco(estabelecimentoId: string, accountId: string) {
    return findEnderecoForAccountDb(this.db, estabelecimentoId, accountId);
  }

  upsertEndereco(estabelecimentoId: string, accountId: string, input: UpsertEnderecoInput) {
    return upsertEnderecoForAccountDb(this.db, estabelecimentoId, accountId, input);
  }

  listHorarios(estabelecimentoId: string, accountId: string) {
    return listHorariosForAccountDb(this.db, estabelecimentoId, accountId);
  }

  replaceHorarios(
    estabelecimentoId: string,
    accountId: string,
    intervalos: HorarioIntervaloInput[],
  ) {
    return replaceHorariosForAccountDb(this.db, estabelecimentoId, accountId, intervalos);
  }

  listMidias(estabelecimentoId: string, accountId: string) {
    return listMidiasForAccountDb(this.db, estabelecimentoId, accountId);
  }

  insertMidia(params: Parameters<EstabelecimentoRepository['insertMidia']>[0]) {
    return insertMidiaDb(this.db, params);
  }

  countMidias(estabelecimentoId: string, accountId: string) {
    return countMidiasForAccountDb(this.db, estabelecimentoId, accountId);
  }

  deleteMidia(midiaId: string, accountId: string) {
    return deleteMidiaForAccountDb(this.db, midiaId, accountId);
  }

  reorderMidias(estabelecimentoId: string, accountId: string, idsOrdenados: string[]) {
    return reorderMidiasForAccountDb(this.db, estabelecimentoId, accountId, idsOrdenados);
  }

  listAvaliacoes(
    estabelecimentoId: string,
    accountId: string,
    page: number,
    pageSize: number,
  ) {
    return listAvaliacoesForAccountDb(this.db, estabelecimentoId, accountId, page, pageSize);
  }

  findAvaliacaoById(estabelecimentoId: string, accountId: string, avaliacaoId: string) {
    return findAvaliacaoByIdForAccountDb(this.db, estabelecimentoId, accountId, avaliacaoId);
  }

  updateAvaliacaoResposta(
    avaliacaoId: string,
    estabelecimentoId: string,
    accountId: string,
    resposta: string,
  ) {
    return updateAvaliacaoRespostaDb(
      this.db,
      avaliacaoId,
      estabelecimentoId,
      accountId,
      resposta,
    );
  }
}
