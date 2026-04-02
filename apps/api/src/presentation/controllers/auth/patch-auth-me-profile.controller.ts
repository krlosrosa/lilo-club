import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { patchAuthMeBodySchema } from '@lilo-hub/contracts';
import { PatchAuthMeProfileUsecase } from '../../../application/usecases/patch-auth-me-profile.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@ApiTags('auth')
@Controller('auth')
export class PatchAuthMeProfileController {
  constructor(private readonly patchProfile: PatchAuthMeProfileUsecase) {}

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualiza nome e tipo de perfil', operationId: 'patchAuthMeProfile' })
  @ApiBody({ schema: { type: 'object' } })
  @ApiResponse({ status: 200 })
  execute(@CurrentUserId() userId: string, @Body() body: unknown) {
    const parsed = patchAuthMeBodySchema.parse(body);
    return this.patchProfile.execute(userId, parsed);
  }
}
