import { ROLE } from '$enums/index';
import { CMS, Delete, Get, Post, Put, RequirePermission } from '$helpers/decorator';
import { Request } from 'express';
import * as service from '$services/cms.category';
import { validate } from '$helpers/ajv';
import { createCategorySchema, updateCategorySchema } from '$validators/cms.category';

@CMS('/category')
export default class CategoryController {
  @Post('')
  @RequirePermission([ROLE.ADMIN])
  async createCategory(req: Request) {
    const body = req.body;
    validate(createCategorySchema, body);
    return await service.createCategory(body);
  }

  @Put('/')
  @RequirePermission([ROLE.ADMIN])
  async updateCategory(req: Request) {
    const body = { ...req.body };
    validate(updateCategorySchema, body);
    return await service.updateCategory(body);
  }

  @Get('/:id')
  @RequirePermission([ROLE.ADMIN])
  async getCategoryById(req: Request) {
    return await service.getCategoryById(Number(req.params.id));
  }

  @Get('')
  @RequirePermission([ROLE.ADMIN])
  async getCategories(req: Request) {
    return await service.getCategories({ ...req.query });
  }

  @Delete('/:id')
  @RequirePermission([ROLE.ADMIN])
  async deleteCategoryById(req: Request) {
    return await service.deleteCategoryById(Number(req.params.id));
  }
}
