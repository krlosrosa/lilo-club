import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE_PROVIDER } from './drizzle.constants.js';
import { createDrizzleClient } from './drizzle.provider.js';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_PROVIDER,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => createDrizzleClient(config),
    },
  ],
  exports: [DRIZZLE_PROVIDER],
})
export class DrizzleModule {}
