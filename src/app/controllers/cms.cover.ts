import { ROLE } from "$enums/index";
import { validate } from "$helpers/ajv";
import { CMS, Get, Post, RequirePermission } from "$helpers/decorator";
import { changeCoverShema } from "$validators/cms.cover";
import { Request } from "express";
import * as service from '$services/cms.cover';

@CMS('/cover')
export default class CoverController {
    @Post('/change')
    @RequirePermission([ROLE.ADMIN])
    async changeCover(req: Request) {
      const body = req.body;
      validate(changeCoverShema, body);
      return await service.changeCover(body);
    }

    @Get('')
    @RequirePermission([ROLE.ADMIN])
    async getCover(req: Request) {
      return await service.getCover();
    }
    
}