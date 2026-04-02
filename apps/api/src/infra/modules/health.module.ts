import { Module } from '@nestjs/common';
import { GetHealthController } from '../../presentation/controllers/health/get-health.controller.js';
import { GetHealthUsecase } from '../../application/usecases/get-health.usecase.js';

@Module({
  controllers: [GetHealthController],
  providers: [GetHealthUsecase],
})
export class HealthModule {}
