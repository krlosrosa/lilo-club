import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PatchMidiasOrdemBody } from '@lilo-hub/contracts';
import {
  listEstabelecimentoMidiasResponseSchema,
  type ListEstabelecimentoMidiasResponse,
} from '@lilo-hub/contracts';
import type { ImageStorageRepository } from '../../domain/repositories/image-storage.repository.js';
import { IMAGE_STORAGE_REPOSITORY } from '../../domain/repositories/image-storage.repository.js';
import {
  ESTABELECIMENTO_REPOSITORY,
  type EstabelecimentoRepository,
} from '../../domain/repositories/estabelecimento.repository.js';
import { ResolveAccountForUserUsecase } from './resolve-account-for-user.usecase.js';

@Injectable()
export class PatchEstabelecimentoMidiasOrdemUsecase {
  constructor(
    private readonly resolveAccount: ResolveAccountForUserUsecase,
    @Inject(ESTABELECIMENTO_REPOSITORY)
    private readonly estabelecimentos: EstabelecimentoRepository,
    @Inject(IMAGE_STORAGE_REPOSITORY) private readonly storage: ImageStorageRepository,
  ) {}

  async execute(
    userId: string,
    estabelecimentoId: string,
    body: PatchMidiasOrdemBody,
  ): Promise<ListEstabelecimentoMidiasResponse> {
    const accountId = await this.resolveAccount.execute(userId);
    const est = await this.estabelecimentos.findByIdAndAccount(estabelecimentoId, accountId);
    if (!est) throw new NotFoundException();
    const ok = await this.estabelecimentos.reorderMidias(
      estabelecimentoId,
      accountId,
      body.idsOrdenados,
    );
    if (!ok) throw new BadRequestException('Ordem inválida');
    const items = await this.estabelecimentos.listMidias(estabelecimentoId, accountId);
    return listEstabelecimentoMidiasResponseSchema.parse({
      items: items.map((m) => ({
        id: m.id,
        estabelecimentoId: m.estabelecimentoId,
        tipo: m.tipo,
        urlPublica: m.urlPublica ?? this.storage.getPublicUrl(m.storageKey),
        ordem: m.ordem,
        createdAt: m.createdAt,
      })),
    });
  }
}
