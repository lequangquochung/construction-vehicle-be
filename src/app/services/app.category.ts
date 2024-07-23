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
    .innerJoin(Translation, 'nt', 'nt.id = r.name.id')
    .leftJoinAndMapMany('r.brands', Brand, 'b', 'b.category.id = r.id')
    .leftJoin(Translation, 'bnt', 'bnt.id = b.name.id');

  const productCountSubquery = getRepository(Product)
    .createQueryBuilder('p')
    .select('p.brand.id', 'brandId')
    .addSelect('COUNT(p.id)', 'productCount');
  if (params.type != null && params.type != '') {
    productCountSubquery.where("p.type = '" + params.type + "'");
    console.log({type: params.type});
  }
  productCountSubquery.groupBy('p.brand.id');

  categoryQuery.leftJoinAndSelect(
    `(${productCountSubquery.getQuery()})`,
    'pc',
    'pc.brandId = b.id'
  );

  const selectFields =
    params.langKey === LangKey.ENG
      ? [
          'r.id AS id',
          'nt.contentEng AS name',
          'r.image AS image',
          'b.id AS brandId',
          'bnt.contentEng AS brandName',
          'COALESCE(pc.productCount, 0) AS productCount',
        ]
      : [
          'r.id AS id',
          'nt.contentVie AS name',
          'r.image AS image',
          'b.id AS brandId',
          'bnt.contentVie AS brandName',
          'COALESCE(pc.productCount, 0) AS productCount',
        ];

  categoryQuery.select(selectFields).groupBy('r.id, nt.id, b.id, bnt.id, r.image, pc.productCount');

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

  const data = await categoryQuery.getRawMany();

  const categoryMap = new Map();

  data.forEach((o) => {
    if (!categoryMap.has(o.id)) {
      categoryMap.set(o.id, {
        id: o.id,
        name: o.name,
        image: o.image,
        brands: [],
      });
    }

    if (o.brandId) {
      categoryMap.get(o.id).brands.push({
        id: o.brandId,
        name: o.brandName,
        productCount: o.productCount,
      });
    }
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
