import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { midiaTipoSchema, midiaUploadResponseSchema } from '@lilo-hub/contracts';
import type { ImageStorageRepository } from '../../domain/repositories/image-storage.repository.js';
import { IMAGE_STORAGE_REPOSITORY } from '../../domain/repositories/image-storage.repository.js';
import {
  ACCOUNT_REPOSITORY,
  type AccountRepository,
} from '../../domain/repositories/account.repository.js';
import {
  ESTABELECIMENTO_REPOSITORY,
  type EstabelecimentoRepository,
} from '../../domain/repositories/estabelecimento.repository.js';
import { ResolveAccountForUserUsecase } from './resolve-account-for-user.usecase.js';
import { randomUUID } from 'node:crypto';

function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };
  return map[mime.toLowerCase()] ?? '.bin';
}

@Injectable()
export class UploadEstabelecimentoMidiaUsecase {
  constructor(
    private readonly resolveAccount: ResolveAccountForUserUsecase,
    @Inject(ESTABELECIMENTO_REPOSITORY)
    private readonly estabelecimentos: EstabelecimentoRepository,
    @Inject(ACCOUNT_REPOSITORY) private readonly accounts: AccountRepository,
    @Inject(IMAGE_STORAGE_REPOSITORY) private readonly storage: ImageStorageRepository,
  ) {}

  async execute(params: {
    userId: string;
    estabelecimentoId: string;
    tipoRaw: string;
    buffer: Buffer;
    contentType: string;
  }) {
    const accountId = await this.resolveAccount.execute(params.userId);
    const est = await this.estabelecimentos.findByIdAndAccount(
      params.estabelecimentoId,
      accountId,
    );
    if (!est) throw new NotFoundException();

    const tipo = midiaTipoSchema.parse(params.tipoRaw);

    const sub = await this.accounts.findActiveSubscription(accountId);
    if (!sub) throw new BadRequestException('Assinatura ausente');
    const plan = await this.accounts.findPlanById(sub.planId);
    if (!plan) throw new BadRequestException('Plano ausente');

    const count = await this.estabelecimentos.countMidias(
      params.estabelecimentoId,
      accountId,
    );
    if (
      plan.maxMidiasPorEstabelecimento !== null &&
      count >= plan.maxMidiasPorEstabelecimento
    ) {
      throw new BadRequestException('Limite de mídias atingido');
    }

    const ext = extFromMime(params.contentType);
    const key = `estabelecimentos/${params.estabelecimentoId}/${randomUUID()}${ext}`;

    await this.storage.putObject({
      key,
      body: params.buffer,
      contentType: params.contentType,
    });

    const urlPublica = this.storage.getPublicUrl(key);

    const created = await this.estabelecimentos.insertMidia({
      estabelecimentoId: params.estabelecimentoId,
      tipo,
      storageKey: key,
      urlPublica,
      ordem: count,
    });

    return midiaUploadResponseSchema.parse({
      id: created.id,
      estabelecimentoId: created.estabelecimentoId,
      tipo: created.tipo,
      urlPublica: created.urlPublica,
      ordem: created.ordem,
      createdAt: created.createdAt,
    });
  }
}
