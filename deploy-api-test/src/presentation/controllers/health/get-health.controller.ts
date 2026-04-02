import { Controller, Get } from '@nestjs/common';
import { GetHealthUsecase } from '../../../application/usecases/get-health.usecase.js';

@Controller('health')
export class GetHealthController {
  constructor(private readonly getHealth: GetHealthUsecase) {}

  @Get()
  execute() {
    return this.getHealth.execute();
  }
}
