import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  estabelecimentoAvaliacaoItemSchema,
  type PatchEstabelecimentoAvaliacaoBody,
} from '@lilo-hub/contracts';
import {
  ESTABELECIMENTO_REPOSITORY,
  type EstabelecimentoRepository,
} from '../../domain/repositories/estabelecimento.repository.js';
import { ResolveAccountForUserUsecase } from './resolve-account-for-user.usecase.js';

@Injectable()
export class PatchEstabelecimentoAvaliacaoUsecase {
  constructor(
    private readonly resolveAccount: ResolveAccountForUserUsecase,
    @Inject(ESTABELECIMENTO_REPOSITORY)
    private readonly estabelecimentos: EstabelecimentoRepository,
  ) {}

  async execute(
    userId: string,
    estabelecimentoId: string,
    avaliacaoId: string,
    body: PatchEstabelecimentoAvaliacaoBody,
  ) {
    const accountId = await this.resolveAccount.execute(userId);
    const est = await this.estabelecimentos.findByIdAndAccount(estabelecimentoId, accountId);
    if (!est) throw new NotFoundException();
    const updated = await this.estabelecimentos.updateAvaliacaoResposta(
      avaliacaoId,
      estabelecimentoId,
      accountId,
      body.resposta,
    );
    if (!updated) throw new NotFoundException();
    return estabelecimentoAvaliacaoItemSchema.parse({
      id: updated.id,
      estabelecimentoId: updated.estabelecimentoId,
      nota: updated.nota,
      comentario: updated.comentario,
      resposta: updated.resposta,
      respondidoEm: updated.respondidoEm,
      destaquePositivo: updated.destaquePositivo,
      utilCount: updated.utilCount,
      createdAt: updated.createdAt,
    });
  }
}
