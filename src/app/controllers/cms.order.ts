import { ROLE } from '$enums/index';
import { validate } from '$helpers/ajv';
import { CMS, Delete, Get, Post, Put, RequirePermission } from '$helpers/decorator';
import { createOrderSchema, updateOrderSchema } from '$validators/cms.order';
import { Request } from 'express';
import * as service from '$services/cms.order';

@CMS('/order')
export default class OrderController {
  @Post('')
  @RequirePermission([ROLE.ADMIN])
  async createOrder(req: Request) {
    const body = req.body;
    validate(createOrderSchema, body);
    return await service.createOrder(body);
  }

  @Get('/:id')
  @RequirePermission([ROLE.ADMIN])
  async getOrderById(req: Request) {
    return await service.getOrderById(Number(req.params.id));
  }

  @Put('/:id')
  @RequirePermission([ROLE.ADMIN])
  async updateOrder(req: Request) {
    const body = req.body;
    validate(updateOrderSchema, body);
    return await service.updateOrder(body);
  }

  @Delete('/:id')
  @RequirePermission([ROLE.ADMIN])
  async deleteOrder(req: Request) {
    return await service.deleteOrder(Number(req.params.id));
  }

  @Put('/:id/finished')
  @RequirePermission([ROLE.ADMIN])
  async finishOrder(req: Request) {
    return await service.finishOrder(Number(req.params.id));
  }

  @Put('/:id/process')
  @RequirePermission([ROLE.ADMIN])
  async setProcessOrder(req: Request) {
    return await service.setProcessOrder(Number(req.params.id));
  }

  @Put('/:id/canceled')
  @RequirePermission([ROLE.ADMIN])
  async cancelOrder(req: Request) {
    return await service.cancelOrder(Number(req.params.id));
  }

  @Get('')
  @RequirePermission([ROLE.ADMIN])
  async getListOrder(req: Request) {
    return await service.getOrders({ ...req.query });
  }
}
