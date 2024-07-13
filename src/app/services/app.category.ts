import Category from '$entities/Category';
import Product from '$entities/Product';
import Translation from '$entities/Translation';
import { ErrorCode, LangKey } from '$enums/index';
import { getRepository } from 'typeorm';

interface ISearchCategory {
  keyword?: string;
  langKey: LangKey;
  type?: string;
}

export async function userGetCategories(params: ISearchCategory) {
  const query = getRepository(Category)
    .createQueryBuilder('r')
    .innerJoin(Translation, 'nt', 'nt.id = r.name.id');
  if (!params.type) {
    query.leftJoinAndSelect(
      (subQuery) =>
        subQuery
          .select('p.category.id', 'categoryId')
          .addSelect('COUNT(p.id)', 'productCount')
          .from(Product, 'p')
          .groupBy('p.category.id'),
      'pc',
      'pc.categoryId = r.id'
    );
  } else {
    query.leftJoinAndSelect(
      (subQuery) =>
        subQuery
          .select('p.category.id', 'categoryId')
          .addSelect('COUNT(p.id)', 'productCount')
          .from(Product, 'p')
          .where('p.type = :type', {
            type: params.type,
          })
          .groupBy('p.category.id'),
      'pc',
      'pc.categoryId = r.id'
    );
  }

  if (params.langKey === LangKey.ENG) {
    query.select([
      'r.id as id',
      'nt.contentEng as name',
      'r.image as image',
      'COALESCE(pc.productCount, 0) as productCount',
    ]);
  } else {
    query.select([
      'r.id as id',
      'nt.contentVie as name',
      'r.image as image',
      'COALESCE(pc.productCount, 0) as productCount',
    ]);
  }

  if (params.keyword) {
    query.andWhere('r.id = :id OR nt.contentEng LIKE :keyword OR nt.contentVie LIKE :keyword', {
      id: params.keyword,
      keyword: '%' + params.keyword + '%',
    });
  }

  if (params.type) {
    query.andWhere('productCount > 0');
  }

  query.orderBy('r.id', 'ASC');

  const [data, total] = await Promise.all([query.getRawMany(), query.getCount()]);

  return {
    data: data.map((d) => ({
      id: d.id,
      name: d.name,
      image: d.image,
      productCount: d.productCount,
    })),
    total,
  };
}

export async function userGetCategoryById(id: number, langKey: LangKey) {
  const category = await getRepository(Category).findOne(id, { relations: ['name'] });
  if (!category) {
    throw ErrorCode.Category_Not_Exist;
  }
  return {
    id: category.id,
    name: LangKey.ENG === langKey ? category.name.contentEng : category.name.contentVie,
    image: category.image,
  };
}
