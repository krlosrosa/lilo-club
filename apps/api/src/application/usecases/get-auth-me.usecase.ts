import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { UserRecord } from '../../domain/model/user.model.js';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repositories/user.repository.js';

@Injectable()
export class GetAuthMeUsecase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(userId: string): Promise<UserRecord> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
