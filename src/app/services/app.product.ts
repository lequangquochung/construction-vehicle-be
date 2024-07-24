import Brand from '$entities/Brand';
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
  type?: string;
  langKey: LangKey;
  isDiscount?: boolean;
  isHot?: boolean;
  categoryIds?: string;
  brandId?: number;
}

export async function userGetProducts(params: ISearchProduct) {
  assignPaging(params);
  const query = getRepository(Product)
    .createQueryBuilder('p')
    .innerJoin(Translation, 'nt', 'nt.id = p.name.id')
    .innerJoin(Translation, 'dt', 'dt.id = p.description.id')
    .innerJoin(Brand, 'b', 'b.id = p.brand.id')
    .innerJoin(Translation, 'bnt', 'bnt.id = b.name.id')
    .innerJoin(Category, 'c', 'c.id = p.category.id')
    .innerJoin(Translation, 'cnt', 'cnt.id = c.name.id');

  if (params.langKey === LangKey.ENG) {
    query.select([
      'p.id as id',
      'nt.contentEng as name',
      'dt.contentEng as description',
      'b.id as brandId',
      'bnt.contentEng as brandName',
      'c.id as categoryId',
      'cnt.contentEng as categoryName',
      'p.model as model',
      'p.image as image',
      'p.type as type',
      'p.price as price',
      'p.isDiscount as isDiscount',
      'p.isHot as isHot',
      'p.discount as discount',
    ]);
  } else {
    query.select([
      'p.id as id',
      'nt.contentVie as name',
      'dt.contentVie as description',
      'b.id as brandId',
      'bnt.contentVie as brandName',
      'c.id as categoryId',
      'cnt.contentVie as categoryName',
      'p.model as model',
      'p.image as image',
      'p.type as type',
      'p.price as price',
      'p.isDiscount as isDiscount',
      'p.isHot as isHot',
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

  if (params.isHot != null) {
    query.andWhere('p.isHot = :isHot', {
      isHot: params.isHot,
    });
  }

  if (params.categoryIds != null && params.categoryIds.length > 0) {
    const categoryIds = params.categoryIds.split(',').map(Number);
    query.andWhere('c.id IN (:...categoryIds)', { categoryIds });
  }

  if (params.brandId) {
    query.andWhere('b.id = :brandId', { brandId: params.brandId });
  }

  query.offset(params.skip).limit(params.pageSize);
  query.orderBy('p.isHot', 'DESC');

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
        brand: {
          id: p.brandId,
          name: p.brandName,
        },
        model: p.model,
        image: p.image,
        type: p.type,
        price: p.price,
        isDiscount: p.isDiscount,
        isHot: p.isHot,
        discount: p.discount,
      })),
    },
    total,
    params
  );
}

export async function userGetPrductById(id: number, langKey: LangKey) {
  const product = await getRepository(Product).findOne(id, {
    relations: ['name', 'description', 'brand', 'brand.name', 'category', 'category.name'],
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
    brand: {
      id: product.brand.id,
      name: langKey === LangKey.ENG ? product.brand.name.contentEng : product.brand.name.contentVie,
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
    isHot: product.isHot,
    discount: product.discount,
  };
}
