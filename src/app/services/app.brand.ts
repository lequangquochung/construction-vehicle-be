import Brand from '$entities/Brand';
import Translation from '$entities/Translation';
import { ErrorCode, LangKey } from '$enums/index';
import { getRepository } from 'typeorm';

interface ISearchBrand {
  keyword?: string;
  langKey: LangKey;
}

export async function userGetBrands(params: ISearchBrand) {
  const query = getRepository(Brand)
    .createQueryBuilder('r')
    .innerJoin(Translation, 'nt', 'nt.id = r.name.id');

  if (params.langKey === LangKey.ENG) {
    query.select(['r.id as id', 'nt.contentEng as name']);
  } else {
    query.select(['r.id as id', 'nt.contentVie as name']);
  }

  if (params.keyword) {
    query.andWhere('r.id = :id OR nt.contentEng LIKE :keyword OR nt.contentVie LIKE :keyword', {
      id: params.keyword,
      keyword: '%' + params.keyword + '%',
    });
  }

  query.orderBy('r.id', 'ASC');

  const [data, total] = await Promise.all([query.getRawMany(), query.getCount()]);

  return {
    data: data.map((d) => ({
      id: d.id,
      name: d.name,
    })),
    total,
  };
}

export async function userGetBrandById(id: number, langKey: LangKey) {
  const brand = await getRepository(Brand).findOne(id, {
    relations: ['name'],
  });
  if (!brand) {
    throw ErrorCode.Brand_Not_Exist;
  }
  return {
    id: brand.id,
    name: LangKey.ENG === langKey ? brand.name.contentEng : brand.name.contentVie,
  };
}
