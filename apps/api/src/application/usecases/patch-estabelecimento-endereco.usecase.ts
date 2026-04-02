import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  estabelecimentoEnderecoSchema,
  type EstabelecimentoEndereco,
  type PatchEstabelecimentoEnderecoBody,
} from '@lilo-hub/contracts';
import {
  ESTABELECIMENTO_REPOSITORY,
  type EstabelecimentoRepository,
} from '../../domain/repositories/estabelecimento.repository.js';
import { ResolveAccountForUserUsecase } from './resolve-account-for-user.usecase.js';

@Injectable()
export class PatchEstabelecimentoEnderecoUsecase {
  constructor(
    private readonly resolveAccount: ResolveAccountForUserUsecase,
    @Inject(ESTABELECIMENTO_REPOSITORY)
    private readonly estabelecimentos: EstabelecimentoRepository,
  ) {}

  async execute(
    userId: string,
    estabelecimentoId: string,
    body: PatchEstabelecimentoEnderecoBody,
  ): Promise<EstabelecimentoEndereco> {
    const accountId = await this.resolveAccount.execute(userId);
    const est = await this.estabelecimentos.findByIdAndAccount(estabelecimentoId, accountId);
    if (!est) throw new NotFoundException();
    const saved = await this.estabelecimentos.upsertEndereco(estabelecimentoId, accountId, body);
    if (!saved) throw new NotFoundException();
    return estabelecimentoEnderecoSchema.parse(saved);
  }
}
