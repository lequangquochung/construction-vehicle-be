import { LangKey } from '$enums/index';
import { APP, Get, GetPublic } from '$helpers/decorator';
import * as service from '$services/app.category';
import { Request } from 'express';

@APP('/category')
export default class UserCategoryController {
  @GetPublic('/:langKey')
  async userGetCategories(req: Request) {
    const { langKey } = req.params;
    const languageKey = langKey as LangKey;
    return await service.userGetCategories({ ...req.query, langKey: languageKey });
  }

  @GetPublic('/:id/:langKey')
  async userGetCategoryById(req: Request) {
    const { id, langKey } = req.params;
    const languageKey = langKey as LangKey;
    return await service.userGetCategoryById(Number(id), languageKey);
  }
}
