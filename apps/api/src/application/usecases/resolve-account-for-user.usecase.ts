import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
export class ResolveAccountForUserUsecase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY) private readonly accounts: AccountRepository,
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(userId: string): Promise<string> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const nomeConta =
      user.nome?.trim() || user.email.split('@')[0] || 'Minha conta';
    const { accountId } = await this.accounts.ensureBootstrapAccount(
      userId,
      nomeConta,
      SEED_IDS.planFree,
    );
    return accountId;
  }
}
