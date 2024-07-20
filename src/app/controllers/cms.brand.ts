import { ROLE } from '$enums/index';
import { CMS, Delete, Get, Post, Put, RequirePermission } from '$helpers/decorator';
import { Request } from 'express';
import * as service from '$services/cms.brand';
import { validate } from '$helpers/ajv';
import { createBrandSchema, updateBrandSchema } from '$validators/cms.brand';

@CMS('/brand')
export default class BrandController {
  @Post('')
  @RequirePermission([ROLE.ADMIN])
  async createBrand(req: Request) {
    const body = req.body;
    validate(createBrandSchema, body);
    return await service.createBrand(body);
  }

  @Put('/')
  @RequirePermission([ROLE.ADMIN])
  async updateBrand(req: Request) {
    const body = { ...req.body };
    validate(updateBrandSchema, body);
    return await service.updateBrand(body);
  }

  @Get('/:id')
  @RequirePermission([ROLE.ADMIN])
  async getBrandById(req: Request) {
    return await service.getBrandById(Number(req.params.id));
  }

  @Get('')
  @RequirePermission([ROLE.ADMIN])
  async getBrands(req: Request) {
    return await service.getBrands({ ...req.query });
  }

  @Delete('/:id')
  @RequirePermission([ROLE.ADMIN])
  async deleteBrandById(req: Request) {
    return await service.deleteBrandById(Number(req.params.id));
  }
}
