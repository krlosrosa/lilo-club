import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { accountMeResponseSchema, type AccountMeResponse } from '@lilo-hub/contracts';
import {
  ACCOUNT_REPOSITORY,
  type AccountRepository,
} from '../../domain/repositories/account.repository.js';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repositories/user.repository.js';
import { SEED_IDS } from '../../infra/db/seed.constants.js';

@Injectable()
export class GetAccountMeUsecase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY) private readonly accounts: AccountRepository,
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(userId: string): Promise<AccountMeResponse> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const nomeConta =
      user.nome?.trim() || user.email.split('@')[0] || 'Minha conta';
    await this.accounts.ensureBootstrapAccount(
      userId,
      nomeConta,
      SEED_IDS.planFree,
    );

    const bundle = await this.accounts.findMembershipByUserId(userId);
    if (!bundle) {
      throw new InternalServerErrorException('Account membership missing');
    }

    const sub = await this.accounts.findActiveSubscription(bundle.account.id);
    if (!sub) {
      throw new InternalServerErrorException('Subscription missing');
    }

    const plan = await this.accounts.findPlanById(sub.planId);
    if (!plan) {
      throw new InternalServerErrorException('Plan missing');
    }

    return accountMeResponseSchema.parse({
      accountId: bundle.account.id,
      accountNome: bundle.account.nome,
      planSlug: plan.slug,
      planNome: plan.nome,
      maxEstabelecimentos: plan.maxEstabelecimentos,
      maxMidiasPorEstabelecimento: plan.maxMidiasPorEstabelecimento,
      seloPremium: plan.seloPremium,
      subscriptionStatus: sub.status,
    });
  }
}
