import { Module } from '@nestjs/common';
import { EnvModule } from './infra/config/env.module.js';
import { DrizzleModule } from './infra/db/providers/drizzle/drizzle.module.js';
import { AccountModule } from './infra/modules/account.module.js';
import { AuthModule } from './infra/modules/auth.module.js';
import { CatalogModule } from './infra/modules/catalog.module.js';
import { EstabelecimentoModule } from './infra/modules/estabelecimento.module.js';
import { HealthModule } from './infra/modules/health.module.js';

@Module({
  imports: [
    EnvModule,
    DrizzleModule,
    HealthModule,
    AuthModule,
    CatalogModule,
    AccountModule,
    EstabelecimentoModule,
  ],
})
export class AppModule {}
