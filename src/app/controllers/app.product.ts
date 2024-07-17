import { LangKey } from '$enums/index';
import { APP, Get } from '$helpers/decorator';
import { convertDataConfig } from '$helpers/utils';
import * as service from '$services/app.product';
import { Request } from 'express';

@APP('/product')
export default class UserProductController {
  @Get('/:langKey', [])
  async userGetProducts(req: Request) {
    const { langKey } = req.params;
    const { keyword, categoryId, type, isDiscount } = req.query;
    const languageKey = langKey as LangKey;
    return await service.userGetProducts({
      keyword: keyword ? keyword + '' : null,
      categoryId: Number(categoryId),
      langKey: languageKey,
      type: type ? type + '' : null,
      isDiscount: isDiscount != null && isDiscount.length !== 0 ? convertDataConfig('BOOLEAN', isDiscount) : null,
    });
  }

  @Get('/:id/:langKey', [])
  async userGetProductDetail(req: Request) {
    const { id, langKey } = req.params;
    const languageKey = langKey as LangKey;
    return await service.userGetPrductById(Number(id), languageKey);
  }
}
