import Brand from '$entities/Brand';
import Category from '$entities/Category';
import Product from '$entities/Product';
import ProductGallery from '$entities/ProductGallery';
import Translation from '$entities/Translation';
import { ErrorCode, ProductStatus, ProductType } from '$enums/index';
import { assignPaging, convertDataConfig, returnPaging } from '$helpers/utils';
import { ITranslation, NewPagingParams } from '$interfaces/common';
import { EntityManager, getConnection, getRepository } from 'typeorm';

interface CreateProductDTO {
  name: ITranslation;
  brandId: number;
  description: ITranslation;
  model: string;
  contact?: string;
  amount?: number | 0;
  price?: number;
  gallery: string[];
  type: ProductType;
  discount: number;
  isHot?: boolean | false;
}

export async function createProduct(params: CreateProductDTO) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const productRepo = transaction.getRepository(Product);
    const translationRepo = transaction.getRepository(Translation);
    const productGalleryRepo = transaction.getRepository(ProductGallery);
    const brandRepo = transaction.getRepository(Brand);

    const brand = await brandRepo.findOne(params.brandId);
    if (!brand) {
      throw ErrorCode.Brand_Not_Exist;
    }

    const nameTranslation = await translationRepo.save({
      contentEng: params.name.contentEng,
      contentVie: params.name.contentVie,
      memo: 'product.name',
    });

    const descriptionTranslation = await translationRepo.save({
      contentEng: params.description.contentEng,
      contentVie: params.description.contentVie,
      memo: 'product.description',
    });

    const product = await productRepo.save({
      model: params.model,
      amount: params.amount,
      contact: params.contact,
      price: params.price,
      brand: brand,
      name: nameTranslation,
      description: descriptionTranslation,
      status: ProductStatus.AVAILABLE,
      image: params.gallery[0],
      type: params.type ? params.type : ProductType.VEHICLE,
      isDiscount: params.discount == null || params.discount == 0 ? false : true,
      discount: params.discount,
      isHot: params.isHot,
    });

    const gallery = params.gallery.map((e) => ({
      product: product,
      image: e,
    }));
    await productGalleryRepo.save(gallery);
    return { productId: product.id };
  });
}

export async function getProductById(id: number) {
  const product = await getRepository(Product).findOne(id, {
    relations: [
      'name',
      'description',
      'brand',
      'brand.name',
      'brand.category',
      'brand.category.name',
    ],
  });
  if (!product) {
    throw ErrorCode.Product_Not_Exist;
  }

  const gallery = await getRepository(ProductGallery).find({
    product: product,
  });

  return {
    name: {
      contentEng: product.name.contentEng,
      contentVie: product.name.contentVie,
    },
    brand: {
      id: product.brand.id,
      name: {
        contentEng: product.brand.name.contentEng,
        contentVie: product.brand.name.contentVie,
      },
    },
    category: {
      id: product.brand.category.id,
      name: {
        contentEng: product.brand.category.name.contentEng,
        contentVie: product.brand.category.name.contentVie,
      },
    },
    description: {
      contentEng: product.description.contentEng,
      contentVie: product.description.contentVie,
    },
    model: product.model,
    contact: product.contact,
    amount: product.amount,
    price: product.price,
    status: product.status,
    type: product.type,
    gallery: gallery.map((e) => e.image),
    isDiscount: product.isDiscount,
    discount: product.discount,
    isHot: product.isHot,
  };
}

interface UpdateProductDTO {
  id: number;
  name: ITranslation;
  brandId: number;
  description: ITranslation;
  model: string;
  contact?: string;
  amount?: number | 0;
  price?: number;
  gallery: string[];
  status: ProductStatus;
  type: ProductType;
  discount?: number;
  isHot?: boolean | false;
}

export async function updateProduct(params: UpdateProductDTO) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const productRepo = transaction.getRepository(Product);
    const brandRepo = transaction.getRepository(Brand);
    const translationRepo = transaction.getRepository(Translation);
    const productGalleryRepo = transaction.getRepository(ProductGallery);

    const product = await productRepo.findOne(params.id, {
      relations: [
        'name',
        'description',
        'brand',
        'brand.name',
        'brand.category',
        'brand.category.name',
      ],
    });

    if (params.brandId !== product.brand.id) {
      const newBrand = await brandRepo.findOne(params.brandId, {
        relations: ['name'],
      });
      if (!newBrand) {
        throw ErrorCode.Category_Not_Exist;
      }
      product.brand = newBrand;
    }

    await translationRepo.update(product.name.id, {
      contentEng: params.name.contentEng,
      contentVie: params.name.contentVie,
    });

    await translationRepo.update(product.description.id, {
      contentEng: params.description.contentEng,
      contentVie: params.description.contentVie,
    });

    const oldProductGallery = await productGalleryRepo.find({
      product: product,
    });
    await productGalleryRepo.remove(oldProductGallery);

    const newProductGallery = params.gallery.map((e) => ({
      product: product,
      image: e,
    }));
    await productGalleryRepo.save(newProductGallery);
    await productRepo.update(params.id, {
      brand: product.brand,
      model: params.model,
      contact: params.contact,
      amount: params.amount,
      price: params.price,
      status: params.status,
      type: params.type ? params.type : product.type,
      isDiscount: params.discount == null || params.discount == 0 ? false : true,
      discount: params.discount,
      isHot: params.isHot,
    });
    return {
      id: product.id,
      name: {
        contentEng: product.name.contentEng,
        contentVie: product.name.contentVie,
      },
      brand: {
        id: product.brand.id,
        name: {
          contentEng: product.brand.name.contentEng,
          contentVie: product.brand.name.contentVie,
        },
      },
      category: {
        id: product.brand.category.id,
        name: {
          contentEng: product.brand.category.name.contentEng,
          contentVie: product.brand.category.name.contentVie,
        },
      },
      description: {
        contentEng: product.description.contentEng,
        contentVie: product.description.contentVie,
      },
      model: params.model,
      contact: params.contact,
      amount: params.amount,
      product: params.price,
      status: params.status,
      gallery: newProductGallery.map((e) => e.image),
      type: params.type ? params.type : product.type,
      isDiscount: params.discount == null || params.discount == 0 ? false : true,
      discount: params.discount,
      isHot: params.isHot,
    };
  });
}

export async function deleteProductById(id: number) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const productRepo = transaction.getRepository(Product);
    const productGalleryRepo = transaction.getRepository(ProductGallery);

    const product = await productRepo.findOne(id, {
      relations: ['name', 'description'],
    });

    if (!product) {
      throw ErrorCode.Product_Not_Exist;
    }

    const gallery = await productGalleryRepo.find({
      product: product,
    });
    await productGalleryRepo.remove(gallery);

    const translationDelete = [product.name, product.description];
    await productRepo.remove(product);
    await transaction.getRepository(Translation).remove(translationDelete);
  });
}

interface ISearchProduct extends NewPagingParams {
  keyword?: string;
  type?: string;
  isDiscount?: boolean;
  brandId?: number;
  categoryId?: number;
  isHot?: boolean;
}

export async function getListProduct(params: ISearchProduct) {
  assignPaging(params);
  const query = getRepository(Product)
    .createQueryBuilder('p')
    .innerJoin(Translation, 'nt', 'nt.id = p.name.id')
    .innerJoin(Translation, 'dt', 'dt.id = p.description.id')
    .innerJoin(Brand, 'b', 'b.id = p.brand.id')
    .innerJoin(Translation, 'bnt', 'bnt.id = b.name.id')
    .innerJoin(Category, 'c', 'c.id = b.category.id')
    .innerJoin(Translation, 'cnt', 'cnt.id = c.name.id')
    .select([
      'p.id as id',
      'nt.contentEng as nameEng',
      'nt.contentVie as nameVie',
      'p.image as image',
      'dt.contentEng as descriptionEng',
      'dt.contentVie as descriptionVie',
      'p.model as model',
      'p.contact as contact',
      'p.amount as amount',
      'p.price as price',
      'p.type as type',
      'p.isDiscount as isDiscount',
      'p.isHot as isHot',
      'p.discount as discount',
      'b.id as brandId',
      'bnt.contentEng as brandNameEng',
      'bnt.contentVie as brandNameVie',
      'c.id as categoryId',
      'cnt.contentEng as categoryNameEng',
      'cnt.contentVie as categoryNameVie',
    ])
    .orderBy('p.id', 'ASC')
    .where('1=1');

  if (params.keyword) {
    query.andWhere('p.id = :id OR nt.contentEng LIKE :keyword OR nt.contentVie LIKE :keyword ', {
      id: params.keyword,
      keyword: '%' + params.keyword + '%',
    });
  }

  if (params.type) {
    query.andWhere('p.type = :type ', {
      type: params.type,
    });
  }

  if (params.isDiscount != null) {
    query.andWhere('p.isDiscount = :isDiscount', {
      isDiscount: convertDataConfig('BOOLEAN', params.isDiscount),
    });
  }

  if (params.isHot != null) {
    query.andWhere('p.isHot = :isHot', {
      isDiscount: convertDataConfig('BOOLEAN', params.isHot),
    });
  }

  if (params.brandId) {
    query.andWhere('b.id = :brandId ', {
      brandId: params.brandId,
    });
  }

  if (params.categoryId) {
    query.andWhere('c.id = :categoryId ', {
      categoryId: params.categoryId,
    });
  }
  query.offset(params.skip).limit(params.pageSize);

  const total = await query.getCount();
  const data = await query.getRawMany();
  return returnPaging(
    {
      data: data.map((p) => ({
        id: p.id,
        name: {
          contentEng: p.nameEng,
          contentVie: p.nameVie,
        },
        image: p.image,
        description: {
          contentEng: p.descriptionEng,
          contentVie: p.descriptionVie,
        },
        model: p.model,
        contact: p.contact,
        price: p.price,
        amount: p.amount,
        type: p.type,
        isDiscount: p.isDiscount,
        isHot: p.isHot,
        discount: p.discount,
        brand: {
          id: p.brandId,
          name: {
            contentEng: p.brandNameEng,
            contentVie: p.brandNameVie,
          },
        },
        category: {
          id: p.categoryId,
          name: {
            contentEng: p.categoryNameEng,
            contentVie: p.categoryNameVie,
          },
        },
      })),
    },
    total,
    params
  );
}
