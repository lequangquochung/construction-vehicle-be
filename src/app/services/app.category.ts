import Brand from '$entities/Brand';
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
  const categoryQuery = getRepository(Category)
    .createQueryBuilder('r')
    .innerJoin(Translation, 'nt', 'nt.id = r.name.id');

  const selectFields =
    params.langKey === LangKey.ENG
      ? ['r.id AS id', 'nt.contentEng AS name', 'r.image AS image']
      : ['r.id AS id', 'nt.contentVie AS name', 'r.image AS image'];

  categoryQuery.select(selectFields);

  if (params.keyword) {
    categoryQuery.andWhere(
      'r.id = :id OR nt.contentEng LIKE :keyword OR nt.contentVie LIKE :keyword',
      {
        id: params.keyword,
        keyword: '%' + params.keyword + '%',
      }
    );
  }

  categoryQuery.orderBy('r.id', 'ASC');

  const categoryData = await categoryQuery.getRawMany();
  const categoryIds = categoryData.map((c) => c.id);

  const brandQuery = getRepository(Brand)
    .createQueryBuilder('b')
    .innerJoin(Translation, 'bnt', 'bnt.id = b.name.id')
    .leftJoinAndMapMany('b.products', Product, 'p', 'b.id = p.brand.id');

  const brandSelectFields =
    params.langKey === LangKey.ENG
      ? [
          'b.id AS id',
          'bnt.contentEng AS name',
          'b.category.id AS categoryId',
          'COALESCE(COUNT(p.id), 0) AS productCount',
        ]
      : [
          'b.id AS id',
          'bnt.contentVie AS name',
          'b.category.id AS categoryId',
          'COALESCE(COUNT(p.id), 0) AS productCount',
        ];
  brandQuery.select(brandSelectFields);

  brandQuery.where('b.category.id IN (:...categoryIds)', { categoryIds: categoryIds });

  if (params.type != null && params.type != '') {
    brandQuery.andWhere('p.type = :type', { type: params.type });
  }
  brandQuery.orderBy('b.id', 'ASC');
  const brands = await brandQuery.getRawMany();

  const categoryMap = new Map();

  categoryData.forEach((c) => {
    if (!categoryMap.has(c.id)) {
      categoryMap.set(c.id, {
        id: c.id,
        name: c.name,
        image: c.image,
        brands: [],
      });
    }

    brands.forEach((b) => {
      if (b.categoryId == c.id) {
        categoryMap.get(c.id).brands.push({
          id: b.id,
          name: b.name,
          productCount: b.productCount,
        });
      }
    });
  });

  const categories = Array.from(categoryMap.values());
  categories.forEach((c) => {
    let totalProductCount = c.brands.reduce((total, brand) => total + brand.productCount, 0);
    c.productCount = totalProductCount;
  });
  return {
    data: categories,
    total: categories.length,
  };
}

export async function userGetCategoryById(id: number, langKey: LangKey) {
  const category = await getRepository(Category).findOne(id, {
    relations: ['name', 'brands', 'brands.name'],
  });
  if (!category) {
    throw ErrorCode.Category_Not_Exist;
  }
  return {
    id: category.id,
    name: LangKey.ENG === langKey ? category.name.contentEng : category.name.contentVie,
    image: category.image,
    brands: category.brands.map((b) => ({
      id: b.id,
      name: LangKey.ENG === langKey ? b.name.contentEng : b.name.contentVie,
    })),
  };
}
