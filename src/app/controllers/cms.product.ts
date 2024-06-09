import { ROLE } from '$enums/index';
import { validate } from '$helpers/ajv';
import { CMS, Delete, Get, Post, Put, RequirePermission } from '$helpers/decorator';
import { createProductSchema, updateProductSchema } from '$validators/cms.product';
import { Request } from 'express';
import * as service from '$services/cms.product';

@CMS('/product')
export default class ProductController {
  @Post('')
  @RequirePermission([ROLE.ADMIN])
  async createProduct(req: Request) {
    const body = req.body;
    validate(createProductSchema, body);
    return await service.createProduct(body);
  }

  @Get('/:id')
  @RequirePermission([ROLE.ADMIN])
  async getProductById(req: Request) {
    return await service.getProductById(Number(req.params.id));
  }

  @Put('')
  @RequirePermission([ROLE.ADMIN])
  async updateProduct(req: Request) {
    const body = req.body;
    validate(updateProductSchema, body);
    return await service.updateProduct(body);
  }

  @Delete('/:id')
  @RequirePermission([ROLE.ADMIN])
  async deleteProductById(req: Request) {
    return await service.deleteProductById(Number(req.params.id));
  }

  @Get('')
  @RequirePermission([ROLE.ADMIN])
  async getListProduct(req: Request) {
    return await service.getListProduct({ ...req.query });
  }
}
