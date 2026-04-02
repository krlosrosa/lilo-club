import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { PatchAuthMeBody } from '@lilo-hub/contracts';
import type { UserRecord } from '../../domain/model/user.model.js';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repositories/user.repository.js';

@Injectable()
export class PatchAuthMeProfileUsecase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(userId: string, body: PatchAuthMeBody): Promise<UserRecord> {
    const updated = await this.users.updateProfile(userId, {
      nome: body.nome,
      tipoUsuario: body.tipoUsuario === undefined ? undefined : body.tipoUsuario,
    });
    if (!updated) {
      throw new UnauthorizedException('User not found');
    }
    return updated;
  }
}
