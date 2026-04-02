import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ImageStorageRepository } from '../../domain/repositories/image-storage.repository.js';
import { IMAGE_STORAGE_REPOSITORY } from '../../domain/repositories/image-storage.repository.js';
import {
  ESTABELECIMENTO_REPOSITORY,
  type EstabelecimentoRepository,
} from '../../domain/repositories/estabelecimento.repository.js';
import { ResolveAccountForUserUsecase } from './resolve-account-for-user.usecase.js';

@Injectable()
export class DeleteEstabelecimentoMidiaUsecase {
  constructor(
    private readonly resolveAccount: ResolveAccountForUserUsecase,
    @Inject(ESTABELECIMENTO_REPOSITORY)
    private readonly estabelecimentos: EstabelecimentoRepository,
    @Inject(IMAGE_STORAGE_REPOSITORY) private readonly storage: ImageStorageRepository,
  ) {}

  async execute(userId: string, midiaId: string): Promise<void> {
    const accountId = await this.resolveAccount.execute(userId);
    const row = await this.estabelecimentos.deleteMidia(midiaId, accountId);
    if (!row) throw new NotFoundException();
    try {
      await this.storage.deleteObject(row.storageKey);
    } catch {
      /* ignore storage errors — row already removed */
    }
  }
}
