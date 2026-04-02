import { Inject, Injectable } from '@nestjs/common';
import {
  listEstabelecimentosResponseSchema,
  type ListEstabelecimentosResponse,
} from '@lilo-hub/contracts';
import {
  ESTABELECIMENTO_REPOSITORY,
  type EstabelecimentoRepository,
} from '../../domain/repositories/estabelecimento.repository.js';
import { ResolveAccountForUserUsecase } from './resolve-account-for-user.usecase.js';

@Injectable()
export class ListEstabelecimentosUsecase {
  constructor(
    private readonly resolveAccount: ResolveAccountForUserUsecase,
    @Inject(ESTABELECIMENTO_REPOSITORY)
    private readonly estabelecimentos: EstabelecimentoRepository,
  ) {}

  async execute(userId: string, search?: string): Promise<ListEstabelecimentosResponse> {
    const accountId = await this.resolveAccount.execute(userId);
    const rows = await this.estabelecimentos.listByAccount(accountId, search);
    return listEstabelecimentosResponseSchema.parse({
      items: rows.map((r) => ({
        id: r.record.id,
        nome: r.record.nome,
        categoriaId: r.record.categoriaId,
        categoriaNome: r.categoriaNome,
        status: r.record.status,
        publicado: r.record.publicado,
        destaque: r.record.destaque,
        scoreMedio: r.record.scoreMedio,
        totalAvaliacoes: r.record.totalAvaliacoes,
      })),
    });
  }
}
