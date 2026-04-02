import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { estabelecimentoEnderecoSchema, type EstabelecimentoEndereco } from '@lilo-hub/contracts';
import {
  ESTABELECIMENTO_REPOSITORY,
  type EstabelecimentoRepository,
} from '../../domain/repositories/estabelecimento.repository.js';
import { ResolveAccountForUserUsecase } from './resolve-account-for-user.usecase.js';

@Injectable()
export class GetEstabelecimentoEnderecoUsecase {
  constructor(
    private readonly resolveAccount: ResolveAccountForUserUsecase,
    @Inject(ESTABELECIMENTO_REPOSITORY)
    private readonly estabelecimentos: EstabelecimentoRepository,
  ) {}

  async execute(
    userId: string,
    estabelecimentoId: string,
  ): Promise<EstabelecimentoEndereco | null> {
    const accountId = await this.resolveAccount.execute(userId);
    const est = await this.estabelecimentos.findByIdAndAccount(estabelecimentoId, accountId);
    if (!est) throw new NotFoundException();
    const end = await this.estabelecimentos.findEndereco(estabelecimentoId, accountId);
    if (!end) return null;
    return estabelecimentoEnderecoSchema.parse(end);
  }
}
