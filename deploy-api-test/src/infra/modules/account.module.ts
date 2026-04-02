import { Module } from '@nestjs/common';
import { GetAccountMeUsecase } from '../../application/usecases/get-account-me.usecase.js';
import { ResolveAccountForUserUsecase } from '../../application/usecases/resolve-account-for-user.usecase.js';
import { ACCOUNT_REPOSITORY } from '../../domain/repositories/account.repository.js';
import { GetAccountMeController } from '../../presentation/controllers/account/get-account-me.controller.js';
import { AccountRepositoryService } from '../db/account/account.service.js';
import { AuthModule } from './auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [GetAccountMeController],
  providers: [
    GetAccountMeUsecase,
    ResolveAccountForUserUsecase,
    { provide: ACCOUNT_REPOSITORY, useClass: AccountRepositoryService },
  ],
  exports: [
    ResolveAccountForUserUsecase,
    ACCOUNT_REPOSITORY,
    GetAccountMeUsecase,
  ],
})
export class AccountModule {}
