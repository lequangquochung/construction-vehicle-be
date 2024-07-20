import Brand from '$entities/Brand';
import Category from '$entities/Category';
import Translation from '$entities/Translation';
import { ErrorCode, LangKey } from '$enums/index';
import { getRepository } from 'typeorm';

interface ISearchBrand {
  keyword?: string;
  langKey: LangKey;
  categoryId?: number;
}

export async function userGetBrands(params: ISearchBrand) {
  const query = getRepository(Brand)
    .createQueryBuilder('r')
    .innerJoin(Translation, 'nt', 'nt.id = r.name.id')
    .innerJoin(Category, 'c', 'c.id = r.category.id')
    .innerJoin(Translation, 'cnt', 'cnt.id = c.name.id');

  if (params.langKey === LangKey.ENG) {
    query.select([
      'r.id as id',
      'nt.contentEng as name',
      'c.id as categoryId',
      'cnt.contentEng as categoryName',
    ]);
  } else {
    query.select([
      'r.id as id',
      'nt.contentVie as name',
      'c.id as categoryId',
      'cnt.contentVie as categoryName',
    ]);
  }

  if (params.keyword) {
    query.andWhere('r.id = :id OR nt.contentEng LIKE :keyword OR nt.contentVie LIKE :keyword', {
      id: params.keyword,
      keyword: '%' + params.keyword + '%',
    });
  }

  if (params.categoryId) {
    query.andWhere('r.category.id = :categoryId', { categoryId: params.categoryId });
  }

  query.orderBy('r.id', 'ASC');

  const [data, total] = await Promise.all([query.getRawMany(), query.getCount()]);

  return {
    data: data.map((d) => ({
      id: d.id,
      name: d.name,
      category: {
        id: d.categoryId,
        name: d.categoryName,
      },
    })),
    total,
  };
}

export async function userGetBrandById(id: number, langKey: LangKey) {
  const brand = await getRepository(Brand).findOne(id, {
    relations: ['name', 'category', 'category.name'],
  });
  if (!brand) {
    throw ErrorCode.Brand_Not_Exist;
  }
  return {
    id: brand.id,
    name: LangKey.ENG === langKey ? brand.name.contentEng : brand.name.contentVie,
    category: {
      id: brand.category.id,
      name:
        LangKey.ENG === langKey ? brand.category.name.contentEng : brand.category.name.contentVie,
    },
  };
}
