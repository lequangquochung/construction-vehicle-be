import { LangKey } from '$enums/index';
import { APP, Get } from '$helpers/decorator';
import * as service from '$services/app.category';
import { Request } from 'express';

@APP('/category')
export default class UserCategoryController {
  @Get('/:langKey', [])
  async userGetCategories(req: Request) {
    const { langKey } = req.params;
    const languageKey = langKey as LangKey;
    return await service.userGetCategories({ ...req.query, langKey: languageKey });
  }

  @Get('/side-bar/:langKey', [])
  async userGetSideBar(req: Request) {
    const { langKey } = req.params;
    const languageKey = langKey as LangKey;
    return await service.userGetSideBar({
      type: req.query.type != null && req.query.type != '' ? req.query.type + '' : null,
      langKey: languageKey,
    });
  }

  @Get('/:id/:langKey', [])
  async userGetCategoryById(req: Request) {
    const { id, langKey } = req.params;
    const languageKey = langKey as LangKey;
    return await service.userGetCategoryById(Number(id), languageKey);
  }
}
