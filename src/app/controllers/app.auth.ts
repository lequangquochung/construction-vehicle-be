import { APP, Post, Put, RequirePermission } from '$helpers/decorator';
import { checkRefreshToken, checkToken, checkUserPermission } from '$middlewares/common';
import { validate } from '$helpers/ajv';
import { changePasswordSchema, loginSchema, registerSchema } from '$validators/app.auth';
import * as service from '$services/app.auth';
import { Request } from 'express';
import { ROLE } from '$enums/index';

@APP('/auth')
export default class UserAuthController {
  @Post('/login', [])
  async login(req: Request) {
    const body = req.body;
    validate(loginSchema, body);
    return await service.login(body);
  }

  @Post('/request-access-token', [checkRefreshToken])
  async requestAccessToken(req: Request) {
    const userId = req.userId;
    const accessToken = await service.createAccessToken(userId);
    return { accessToken };
  }

  @Put('/user-change-password')
  @RequirePermission([ROLE.USER])
  async userChangePassword(req: Request) {
    const userId = req.userId;
    const body = req.body;
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
