import { Inject, Injectable } from '@nestjs/common';
import type {
  AccountRecord,
  AccountUserRecord,
  PlanRecord,
  SubscriptionRecord,
} from '../../../domain/model/account-saas.model.js';
import type {
  AccountMembershipBundle,
  AccountRepository,
} from '../../../domain/repositories/account.repository.js';
import { DRIZZLE_PROVIDER } from '../providers/drizzle/drizzle.constants.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { ensureBootstrapAccountDb } from './ensure-bootstrap-account.drizzle.js';
import { findAccountByIdDb } from './find-account-by-id.drizzle.js';
import { findActiveSubscriptionDb } from './find-active-subscription.drizzle.js';
import { findMembershipByUserIdDb } from './find-membership-by-user-id.drizzle.js';
import { findPlanByIdDb } from './find-plan-by-id.drizzle.js';
import { listAccountMembersDb } from './list-account-members.drizzle.js';

@Injectable()
export class AccountRepositoryService implements AccountRepository {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  findById(id: string): Promise<AccountRecord | null> {
    return findAccountByIdDb(this.db, id);
  }

  findMembershipByUserId(userId: string): Promise<AccountMembershipBundle | null> {
    return findMembershipByUserIdDb(this.db, userId);
  }

  ensureBootstrapAccount(
    userId: string,
    accountNome: string,
    planFreeId: string,
  ): Promise<{ accountId: string; created: boolean }> {
    return ensureBootstrapAccountDb(this.db, { userId, accountNome, planFreeId });
  }

  listMembers(accountId: string): Promise<AccountUserRecord[]> {
    return listAccountMembersDb(this.db, accountId);
  }

  findActiveSubscription(accountId: string): Promise<SubscriptionRecord | null> {
    return findActiveSubscriptionDb(this.db, accountId);
  }

  findPlanById(planId: string): Promise<PlanRecord | null> {
    return findPlanByIdDb(this.db, planId);
  }
}
