import {
  BadRequestException,
  Inject,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import type { CreateEstabelecimentoBody, EstabelecimentoDetail } from '@lilo-hub/contracts';
import { estabelecimentoDetailSchema } from '@lilo-hub/contracts';
import {
  ACCOUNT_REPOSITORY,
  type AccountRepository,
} from '../../domain/repositories/account.repository.js';
import {
  ESTABELECIMENTO_REPOSITORY,
  type EstabelecimentoRepository,
} from '../../domain/repositories/estabelecimento.repository.js';
import { DRIZZLE_PROVIDER } from '../../infra/db/providers/drizzle/drizzle.constants.js';
import type { DrizzleClient } from '../../infra/db/providers/drizzle/drizzle.types.js';
import { verifyCategoriaExistsDb } from '../../infra/db/catalog/verify-categoria-exists.drizzle.js';
import { verifyCidadeExistsDb } from '../../infra/db/catalog/verify-cidade-exists.drizzle.js';
import { ResolveAccountForUserUsecase } from './resolve-account-for-user.usecase.js';

@Injectable()
export class CreateEstabelecimentoUsecase {
  constructor(
    private readonly resolveAccount: ResolveAccountForUserUsecase,
    @Inject(ESTABELECIMENTO_REPOSITORY)
    private readonly estabelecimentos: EstabelecimentoRepository,
    @Inject(ACCOUNT_REPOSITORY) private readonly accounts: AccountRepository,
    @Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient,
  ) {}

  async execute(userId: string, body: CreateEstabelecimentoBody): Promise<EstabelecimentoDetail> {
    const accountId = await this.resolveAccount.execute(userId);

    const [okCidade, okCat] = await Promise.all([
      verifyCidadeExistsDb(this.db, body.cidadeId),
      verifyCategoriaExistsDb(this.db, body.categoriaId),
    ]);
    if (!okCidade || !okCat) {
      throw new BadRequestException('Cidade ou categoria inválida');
    }

    const sub = await this.accounts.findActiveSubscription(accountId);
    if (!sub) throw new ForbiddenException('Assinatura não encontrada');
    const plan = await this.accounts.findPlanById(sub.planId);
    if (!plan) throw new ForbiddenException('Plano não encontrado');

    const count = await this.estabelecimentos.countByAccount(accountId);
    if (count >= plan.maxEstabelecimentos) {
      throw new ForbiddenException('Limite de estabelecimentos atingido');
    }

    const created = await this.estabelecimentos.create({
      accountId,
      cidadeId: body.cidadeId,
      categoriaId: body.categoriaId,
      nome: body.nome,
      createdByUserId: userId,
    });

    const categoriaNome =
      (await this.estabelecimentos.findCategoriaNome(created.categoriaId)) ?? '';

    return estabelecimentoDetailSchema.parse({
      id: created.id,
      accountId: created.accountId,
      cidadeId: created.cidadeId,
      categoriaId: created.categoriaId,
      categoriaNome,
      nome: created.nome,
      slug: created.slug,
      descricao: created.descricao,
      conteudoSemantico: created.conteudoSemantico,
      pesoDestaque: created.pesoDestaque,
      status: created.status,
      publicado: created.publicado,
      destaque: created.destaque,
      scoreMedio: created.scoreMedio,
      totalAvaliacoes: created.totalAvaliacoes,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }
}
