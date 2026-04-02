import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  listEstabelecimentoAvaliacoesResponseSchema,
  type ListEstabelecimentoAvaliacoesResponse,
} from '@lilo-hub/contracts';
import {
  ESTABELECIMENTO_REPOSITORY,
  type EstabelecimentoRepository,
} from '../../domain/repositories/estabelecimento.repository.js';
import { ResolveAccountForUserUsecase } from './resolve-account-for-user.usecase.js';

@Injectable()
export class ListEstabelecimentoAvaliacoesUsecase {
  constructor(
    private readonly resolveAccount: ResolveAccountForUserUsecase,
    @Inject(ESTABELECIMENTO_REPOSITORY)
    private readonly estabelecimentos: EstabelecimentoRepository,
  ) {}

  async execute(
    userId: string,
    estabelecimentoId: string,
    page: number,
    pageSize: number,
  ): Promise<ListEstabelecimentoAvaliacoesResponse> {
    const accountId = await this.resolveAccount.execute(userId);
    const est = await this.estabelecimentos.findByIdAndAccount(estabelecimentoId, accountId);
    if (!est) throw new NotFoundException();
    const { items, total } = await this.estabelecimentos.listAvaliacoes(
      estabelecimentoId,
      accountId,
      page,
      pageSize,
    );
    return listEstabelecimentoAvaliacoesResponseSchema.parse({
      items: items.map((a) => ({
        id: a.id,
        estabelecimentoId: a.estabelecimentoId,
        nota: a.nota,
        comentario: a.comentario,
        resposta: a.resposta,
        respondidoEm: a.respondidoEm,
        destaquePositivo: a.destaquePositivo,
        utilCount: a.utilCount,
        createdAt: a.createdAt,
      })),
      total,
      page,
      pageSize,
    });
  }
}
