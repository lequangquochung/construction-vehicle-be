import { APP, Post, Put } from '$helpers/decorator';
import { checkRefreshToken } from '$middlewares/common';
import { validate } from '$helpers/ajv';
import { changePasswordSchema, loginSchema, registerSchema } from '$validators/app.auth';
import * as service from '$services/app.auth';
import { Request } from 'express';

@APP('/auth')
export default class AuthController {
  @Post('/login', [])
  async login(req: Request) {
    const body = req.body;
    validate(loginSchema, body);
    return await service.login(body);
  }

  @Post('/refresh-token', [checkRefreshToken])
  async requestToken(req: Request) {
    const userId = req.body.userId;
    const { refreshToken } = req.body;

    const token = await service.createRefreshToken(userId, refreshToken);
    return { refreshToken: token.refreshToken, token: token.token };
  }

  @Post('/request-access-token', [checkRefreshToken])
  async requestAccessToken(req: Request) {
    const userId = req.body.userId;
    const accessToken = await service.createAccessToken(userId);
    return { accessToken };
  }

  @Put('/change-password')
  async changePassword(req: Request) {
    const { userId, body } = req;
    validate(changePasswordSchema, body);
    await service.changePassword(userId, body);
    return;
  }

  @Post('/register', [])
  async register(req: Request) {
    const { body } = req;
    validate(registerSchema, body);
    return await service.register(body);
  }
}
