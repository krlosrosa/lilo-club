import { Global, Module } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from './drizzle.constants.js';
import { createDrizzleClient } from './drizzle.provider.js';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_PROVIDER,
      useFactory: () => createDrizzleClient(),
    },
  ],
  exports: [DRIZZLE_PROVIDER],
})
export class DrizzleModule {}
