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
    const { keyword, type, isDiscount, categoryIds, brandId, isHot, pageSize, pageIndex } =
      req.query;
    const languageKey = langKey as LangKey;
    return await service.userGetProducts({
      keyword: keyword ? keyword + '' : null,
      langKey: languageKey,
      type: type ? type + '' : null,
      isDiscount:
        isDiscount != null && isDiscount.length !== 0
          ? convertDataConfig('BOOLEAN', isDiscount)
          : null,
      isHot: isHot != null && isHot.length !== 0 ? convertDataConfig('BOOLEAN', isHot) : null,
      categoryIds: categoryIds ? categoryIds + '' : null,
      brandId: brandId ? Number(brandId) : null,
      pageIndex: Number(pageIndex),
      pageSize: Number(pageSize),
    });
  }

  @Get('/:id/:langKey', [])
  async userGetProductDetail(req: Request) {
    const { id, langKey } = req.params;
    const languageKey = langKey as LangKey;
    return await service.userGetPrductById(Number(id), languageKey);
  }
}
