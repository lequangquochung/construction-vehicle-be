import Brand from '$entities/Brand';
import Category from '$entities/Category';
import Product from '$entities/Product';
import Translation from '$entities/Translation';
import { ErrorCode, LangKey } from '$enums/index';
import { getRepository } from 'typeorm';

interface ISearchCategory {
  keyword?: string;
  langKey: LangKey;
}

export async function userGetCategories(params: ISearchCategory) {
  const categoryQuery = getRepository(Category)
    .createQueryBuilder('r')
    .innerJoin(Translation, 'nt', 'nt.id = r.name.id')
    .leftJoinAndMapMany('r.products', Product, 'p', 'p.category.id = r.id');

  const selectFields =
    params.langKey === LangKey.ENG
      ? [
          'r.id AS id',
          'nt.contentEng AS name',
          'r.image AS image',
          'COALESCE(COUNT(p.id), 0) as productCount',
        ]
      : [
          'r.id AS id',
          'nt.contentVie AS name',
          'r.image AS image',
          'COALESCE(COUNT(p.id), 0) as productCount',
        ];

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
  categoryQuery.groupBy('r.id');
  categoryQuery.orderBy('r.id', 'ASC');

  const [data, total] = await Promise.all([categoryQuery.getRawMany(), categoryQuery.getCount()]);

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
  const category = await getRepository(Category).findOne(id, {
    relations: ['name'],
  });
  if (!category) {
    throw ErrorCode.Category_Not_Exist;
  }
  return {
    id: category.id,
    name: LangKey.ENG === langKey ? category.name.contentEng : category.name.contentVie,
    image: category.image,
  };
}

interface ISideBar {
  langKey: LangKey;
  type?: string;
}

export async function userGetSideBar(params: ISideBar) {
  const categoryRepo = getRepository(Category);
  const brandRepo = getRepository(Brand);
  const productRepo = getRepository(Product);

  const categories = await categoryRepo.find({ relations: ['name'] });
  const brands = await brandRepo.find({ relations: ['name'] });

  const productQuery = productRepo
    .createQueryBuilder('p')
    .select([
      'p.id as id',
      'p.type as type',
      'p.brand.id as brandId',
      'p.category.id as categoryId',
    ]);

  if (params.type != null && params.type != '') {
    productQuery.where('p.type = :type', { type: params.type });
  }
  const products = await productQuery.getRawMany();

  let data = [];
  categories.forEach((c) => {
    const arrProduct = products.filter((p) => p.categoryId == c.id);
    let item = {
      categoryId: c.id,
      categoryName: LangKey.ENG === params.langKey ? c.name.contentEng : c.name.contentVie,
      brands: brands.map((b) => ({
        id: b.id,
        name: LangKey.ENG === params.langKey ? b.name.contentEng : b.name.contentVie,
      })),
      productCount: arrProduct == null ? 0 : arrProduct.length,
    };
    data.push(item);
  });
  return {
    data: data,
    total: data.length,
  };
}
