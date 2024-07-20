import { LangKey } from '$enums/index';
import { APP, Get } from '$helpers/decorator';
import * as service from '$services/app.brand';
import { Request } from 'express';

@APP('/brand')
export default class UserBrandController {
  @Get('/:langKey', [])
  async userGetBrands(req: Request) {
    const { langKey } = req.params;
    const languageKey = langKey as LangKey;
    return await service.userGetBrands({ ...req.query, langKey: languageKey });
  }

  @Get('/:id/:langKey', [])
  async userGetBrandById(req: Request) {
    const { id, langKey } = req.params;
    const languageKey = langKey as LangKey;
    return await service.userGetBrandById(Number(id), languageKey);
  }
}
