import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { EstabelecimentoDetail, PatchEstabelecimentoBody } from '@lilo-hub/contracts';
import { estabelecimentoDetailSchema } from '@lilo-hub/contracts';
import {
  ESTABELECIMENTO_REPOSITORY,
  type EstabelecimentoRepository,
} from '../../domain/repositories/estabelecimento.repository.js';
import { DRIZZLE_PROVIDER } from '../../infra/db/providers/drizzle/drizzle.constants.js';
import type { DrizzleClient } from '../../infra/db/providers/drizzle/drizzle.types.js';
import { verifyCategoriaExistsDb } from '../../infra/db/catalog/verify-categoria-exists.drizzle.js';
import { ResolveAccountForUserUsecase } from './resolve-account-for-user.usecase.js';

@Injectable()
export class PatchEstabelecimentoUsecase {
  constructor(
    private readonly resolveAccount: ResolveAccountForUserUsecase,
    @Inject(ESTABELECIMENTO_REPOSITORY)
    private readonly estabelecimentos: EstabelecimentoRepository,
    @Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient,
  ) {}

  async execute(
    userId: string,
    estabelecimentoId: string,
    body: PatchEstabelecimentoBody,
  ): Promise<EstabelecimentoDetail> {
    const accountId = await this.resolveAccount.execute(userId);
    if (body.categoriaId) {
      const ok = await verifyCategoriaExistsDb(this.db, body.categoriaId);
      if (!ok) throw new BadRequestException('Categoria inválida');
    }
    const updated = await this.estabelecimentos.update(estabelecimentoId, accountId, body);
    if (!updated) throw new NotFoundException();
    const categoriaNome =
      (await this.estabelecimentos.findCategoriaNome(updated.categoriaId)) ?? '';
    return estabelecimentoDetailSchema.parse({
      id: updated.id,
      accountId: updated.accountId,
      cidadeId: updated.cidadeId,
      categoriaId: updated.categoriaId,
      categoriaNome,
      nome: updated.nome,
      slug: updated.slug,
      descricao: updated.descricao,
      conteudoSemantico: updated.conteudoSemantico,
      pesoDestaque: updated.pesoDestaque,
      status: updated.status,
      publicado: updated.publicado,
      destaque: updated.destaque,
      scoreMedio: updated.scoreMedio,
      totalAvaliacoes: updated.totalAvaliacoes,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }
}
