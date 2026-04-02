import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { PostAuthLogoutController } from '../../../src/presentation/controllers/auth/post-auth-logout.controller.js';

describe('PostAuthLogoutController', () => {
  it('clears JWT cookie and responds with 204', async () => {
    const end = jest.fn();
    const res = {
      clearCookie: jest.fn(),
      status: jest.fn().mockReturnValue({ end }),
    } as unknown as Response;

    const moduleRef = await Test.createTestingModule({
      controllers: [PostAuthLogoutController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: (key: string) => {
              if (key === 'JWT_COOKIE_NAME') return 'access_token';
              throw new Error(`unexpected ${key}`);
            },
            get: () => 'development',
          },
        },
      ],
    }).compile();

    const controller = moduleRef.get(PostAuthLogoutController);
    controller.execute(res);

    expect(res.clearCookie).toHaveBeenCalledWith(
      'access_token',
      expect.objectContaining({
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      }),
    );
    expect(res.status).toHaveBeenCalledWith(204);
    expect(end).toHaveBeenCalled();
  });
});
