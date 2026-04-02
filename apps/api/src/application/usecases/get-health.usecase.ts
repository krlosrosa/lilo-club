import { Injectable } from '@nestjs/common';
import type { HealthResponse } from '@lilo-hub/contracts';

@Injectable()
export class GetHealthUsecase {
  execute(): HealthResponse {
    return { status: 'ok', service: 'lilo-hub-api' };
  }
}
