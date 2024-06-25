import { LangKey, ROLE } from '$enums/index';
import { validate } from '$helpers/ajv';
import { APP, Get, GetPublic, PostPublic, RequirePermission } from '$helpers/decorator';
import * as service from '$services/app.order';
import { createOrderSchema } from '$validators/cms.order';
import { Request } from 'express';

@APP('/order')
export default class UserOrderController {
  @GetPublic('/:langKey')
  async userSearchOrders(req: Request) {
    const { langKey } = req.params;
    const { phoneNumber, email } = req.query;
    const languageKey = langKey as LangKey;
    return await service.userGetOrders({
      ...req.query,
      phoneNumber: phoneNumber ? phoneNumber + '' : null,
      email: email ? email + '' : null,
      langKey: languageKey,
    });
  }

  @PostPublic('')
  async userCreateOrder(req: Request) {
    const body = req.body;
    validate(createOrderSchema, body);
    return await service.userCreateOrder(body);
  }

  @Get('/my-order/:langKey')
  @RequirePermission([ROLE.USER])
  async userGetMyOrder(req: Request) {
    const userId = req.userId;
    const { langKey } = req.params;
    const { phoneNumber, email } = req.query;
    const languageKey = langKey as LangKey;
    return await service.userGetOrders({
      ...req.query,
      phoneNumber: phoneNumber ? phoneNumber + '' : null,
      email: email ? email + '' : null,
      langKey: languageKey,
      userId: Number(userId),
    });
  }
}
