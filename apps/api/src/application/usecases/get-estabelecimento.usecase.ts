import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { EstabelecimentoDetail } from '@lilo-hub/contracts';
import { estabelecimentoDetailSchema } from '@lilo-hub/contracts';
import {
  ESTABELECIMENTO_REPOSITORY,
  type EstabelecimentoRepository,
} from '../../domain/repositories/estabelecimento.repository.js';
import { ResolveAccountForUserUsecase } from './resolve-account-for-user.usecase.js';

@Injectable()
export class GetEstabelecimentoUsecase {
  constructor(
    private readonly resolveAccount: ResolveAccountForUserUsecase,
    @Inject(ESTABELECIMENTO_REPOSITORY)
    private readonly estabelecimentos: EstabelecimentoRepository,
  ) {}

  async execute(userId: string, estabelecimentoId: string): Promise<EstabelecimentoDetail> {
    const accountId = await this.resolveAccount.execute(userId);
    const row = await this.estabelecimentos.findByIdAndAccount(estabelecimentoId, accountId);
    if (!row) throw new NotFoundException();
    const categoriaNome =
      (await this.estabelecimentos.findCategoriaNome(row.categoriaId)) ?? '';
    return estabelecimentoDetailSchema.parse({
      id: row.id,
      accountId: row.accountId,
      cidadeId: row.cidadeId,
      categoriaId: row.categoriaId,
      categoriaNome,
      nome: row.nome,
      slug: row.slug,
      descricao: row.descricao,
      conteudoSemantico: row.conteudoSemantico,
      pesoDestaque: row.pesoDestaque,
      status: row.status,
      publicado: row.publicado,
      destaque: row.destaque,
      scoreMedio: row.scoreMedio,
      totalAvaliacoes: row.totalAvaliacoes,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
