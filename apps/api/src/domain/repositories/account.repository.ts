import type {
  AccountRecord,
  AccountUserRecord,
  PlanRecord,
  SubscriptionRecord,
} from '../model/account-saas.model.js';

export const ACCOUNT_REPOSITORY = 'IAccountRepository';

export type AccountMembershipBundle = {
  account: AccountRecord;
  membership: AccountUserRecord;
};

export interface AccountRepository {
  findById(id: string): Promise<AccountRecord | null>;
  findMembershipByUserId(userId: string): Promise<AccountMembershipBundle | null>;
  /** Cria conta + membership owner + subscription no plano free quando o usuário ainda não tem conta. */
  ensureBootstrapAccount(
    userId: string,
    accountNome: string,
    planFreeId: string,
  ): Promise<{ accountId: string; created: boolean }>;
  listMembers(accountId: string): Promise<AccountUserRecord[]>;
  findActiveSubscription(accountId: string): Promise<SubscriptionRecord | null>;
  findPlanById(planId: string): Promise<PlanRecord | null>;
}
