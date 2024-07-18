import Category from '$entities/Category';
import Product from '$entities/Product';
import ProductGallery from '$entities/ProductGallery';
import Translation from '$entities/Translation';
import { ErrorCode, LangKey } from '$enums/index';
import { assignPaging, returnPaging } from '$helpers/utils';
import { NewPagingParams } from '$interfaces/common';
import { getRepository } from 'typeorm';

interface ISearchProduct extends NewPagingParams {
  keyword?: string;
  categoryId?: number;
  type?: string;
  langKey: LangKey;
  isDiscount?: boolean;
  categoryIds?: string;
}

export async function userGetProducts(params: ISearchProduct) {
  assignPaging(params);
  const query = getRepository(Product)
    .createQueryBuilder('p')
    .innerJoin(Translation, 'nt', 'nt.id = p.name.id')
    .innerJoin(Translation, 'dt', 'dt.id = p.description.id')
    .innerJoin(Category, 'c', 'c.id = p.category.id')
    .innerJoin(Translation, 'cnt', 'cnt.id = c.name.id');

  if (params.langKey === LangKey.ENG) {
    query.select([
      'p.id as id',
      'nt.contentEng as name',
      'dt.contentEng as description',
      'c.id as categoryId',
      'cnt.contentEng as categoryName',
      'p.model as model',
      'p.image as image',
      'p.type as type',
      'p.price as price',
      'p.isDiscount as isDiscount',
      'p.discount as discount',
    ]);
  } else {
    query.select([
      'p.id as id',
      'nt.contentVie as name',
      'dt.contentVie as description',
      'c.id as categoryId',
      'cnt.contentVie as categoryName',
      'p.model as model',
      'p.image as image',
      'p.type as type',
      'p.price as price',
      'p.isDiscount as isDiscount',
      'p.discount as discount',
    ]);
  }
  query.where('1=1');

  if (params.keyword) {
    query.andWhere('p.id = :id OR nt.contentEng LIKE :keyword OR nt.contentVie LIKE :keyword', {
      id: params.keyword,
      keyword: '%' + params.keyword + '%',
    });
  }

  if (params.categoryId) {
    query.andWhere('p.category.id = :categoryId', {
      categoryId: params.categoryId,
    });
  }

  if (params.type) {
    query.andWhere('p.type = :type', {
      type: params.type,
    });
  }

  if (params.isDiscount != null) {
    query.andWhere('p.isDiscount = :isDiscount', {
      isDiscount: params.isDiscount,
    });
  }

  if (params.categoryIds != null && params.categoryIds.length > 0) {
    const categoryIds = params.categoryIds.split(',').map(Number);
    query.andWhere('p.category.id IN (:...categoryIds)', { categoryIds });
  }

  query.offset(params.skip).limit(params.pageSize);
  query.orderBy('p.id', 'ASC');

  const [data, total] = await Promise.all([query.getRawMany(), query.getCount()]);
  return returnPaging(
    {
      data: data.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: {
          id: p.categoryId,
          name: p.categoryName,
        },
        model: p.model,
        image: p.image,
        type: p.type,
        price: p.price,
        isDiscount: p.isDiscount,
        discount: p.discount,
      })),
    },
    total,
    params
  );
}

export async function userGetPrductById(id: number, langKey: LangKey) {
  const product = await getRepository(Product).findOne(id, {
    relations: ['name', 'description', 'category', 'category.name'],
  });

  if (!product) {
    throw ErrorCode.Product_Not_Exist;
  }

  const gallery = await getRepository(ProductGallery).find({
    product: product,
  });

  return {
    id: id,
    name: langKey === LangKey.ENG ? product.name.contentEng : product.name.contentVie,
    description:
      langKey === LangKey.ENG ? product.description.contentEng : product.description.contentVie,
    category: {
      id: product.category.id,
      name:
        langKey === LangKey.ENG
          ? product.category.name.contentEng
          : product.category.name.contentVie,
    },
    model: product.model,
    status: product.status,
    amount: product.amount,
    price: product.price,
    image: product.image,
    type: product.type,
    contact: product.contact,
    gallery: gallery.map((e) => e.image),
    isDiscount: product.isDiscount,
    discount: product.discount,
  };
}
