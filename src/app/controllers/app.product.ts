import { LangKey } from '$enums/index';
import { APP, GetPublic } from '$helpers/decorator';
import * as service from '$services/app.product';
import { Request } from 'express';

@APP('/product')
export default class UserProductController {
  @GetPublic('/:langKey')
  async userGetProducts(req: Request) {
    const { langKey } = req.params;
    const { keyword, categoryId } = req.query;
    const languageKey = langKey as LangKey;
    return await service.userGetProducts({
      keyword: keyword ? keyword + '' : null,
      categoryId: Number(categoryId),
      langKey: languageKey,
    });
  }

  @GetPublic('/:id/:langKey')
  async userGetProductDetail(req: Request) {
    const { id, langKey } = req.params;
    const languageKey = langKey as LangKey;
    return await service.userGetPrductById(Number(id), languageKey);
  }
}
