import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  listEstabelecimentoHorariosResponseSchema,
  type ListEstabelecimentoHorariosResponse,
} from '@lilo-hub/contracts';
import {
  ESTABELECIMENTO_REPOSITORY,
  type EstabelecimentoRepository,
} from '../../domain/repositories/estabelecimento.repository.js';
import { ResolveAccountForUserUsecase } from './resolve-account-for-user.usecase.js';

@Injectable()
export class GetEstabelecimentoHorariosUsecase {
  constructor(
    private readonly resolveAccount: ResolveAccountForUserUsecase,
    @Inject(ESTABELECIMENTO_REPOSITORY)
    private readonly estabelecimentos: EstabelecimentoRepository,
  ) {}

  async execute(
    userId: string,
    estabelecimentoId: string,
  ): Promise<ListEstabelecimentoHorariosResponse> {
    const accountId = await this.resolveAccount.execute(userId);
    const est = await this.estabelecimentos.findByIdAndAccount(estabelecimentoId, accountId);
    if (!est) throw new NotFoundException();
    const intervalos = await this.estabelecimentos.listHorarios(estabelecimentoId, accountId);
    return listEstabelecimentoHorariosResponseSchema.parse({ intervalos });
  }
}
