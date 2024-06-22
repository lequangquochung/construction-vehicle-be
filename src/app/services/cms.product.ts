import Category from '$entities/Category';
import Product from '$entities/Product';
import ProductGallery from '$entities/ProductGallery';
import Translation from '$entities/Translation';
import { CommonStatus, ErrorCode, LangKey, ProductStatus } from '$enums/index';
import { ITranslation } from '$interfaces/common';
import { EntityManager, getConnection, getRepository } from 'typeorm';

interface CreateProductDTO {
  name: ITranslation;
  categoryId: number;
  description: ITranslation;
  model: string;
  contact?: string;
  amount?: number | 0;
  price?: number;
  gallery: string[];
}

export async function createProduct(params: CreateProductDTO) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const productRepo = transaction.getRepository(Product);
    const translationRepo = transaction.getRepository(Translation);
    const productGalleryRepo = transaction.getRepository(ProductGallery);
    const categoryRepo = transaction.getRepository(Category);

    const category = await categoryRepo.findOne(params.categoryId);
    if (!category) {
      throw ErrorCode.Category_Not_Exist;
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
      ...params,
      category: category,
      name: nameTranslation,
      description: descriptionTranslation,
      status: ProductStatus.AVAILABLE,
      image: params.gallery[0],
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
    relations: ['name', 'description', 'category', 'category.name'],
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
    category: {
      id: product.category.id,
      name: {
        contentEng: product.category.name.contentEng,
        contentVie: product.category.name.contentVie,
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
    gallery: gallery.map((e) => e.image),
  };
}

interface UpdateProductDTO {
  id: number;
  name: ITranslation;
  categoryId: number;
  description: ITranslation;
  model: string;
  contact?: string;
  amount?: number | 0;
  price?: number;
  gallery: string[];
  status: ProductStatus;
}

export async function updateProduct(params: UpdateProductDTO) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const productRepo = transaction.getRepository(Product);
    const categoryRepo = transaction.getRepository(Category);
    const translationRepo = transaction.getRepository(Translation);
    const productGalleryRepo = transaction.getRepository(ProductGallery);

    const product = await productRepo.findOne(params.id, {
      relations: ['name', 'description', 'category', 'category.name'],
    });

    if (params.categoryId !== product.category.id) {
      const newCategory = await categoryRepo.findOne(params.categoryId, {
        relations: ['name'],
      });
      if (!newCategory) {
        throw ErrorCode.Category_Not_Exist;
      }
      product.category = newCategory;
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
    return {
      id: product.id,
      name: {
        contentEng: product.name.contentEng,
        contentVie: product.name.contentVie,
      },
      category: {
        id: product.category.id,
        name: {
          contentEng: product.category.name.contentEng,
          contentVie: product.category.name.contentVie,
        },
      },
      description: {
        contentEng: product.description.contentEng,
        contentVie: product.description.contentVie,
      },
      model: product.model,
      contact: product.contact,
      amount: product.amount,
      product: product.price,
      status: product.status,
      gallery: newProductGallery.map((e) => e.image),
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

interface ISearchProduct {
  keyword?: string;
}

export async function getListProduct(params: ISearchProduct) {
  const query = getRepository(Product)
    .createQueryBuilder('p')
    .innerJoin(Translation, 'nt', 'nt.id = p.name.id')
    .innerJoin(Translation, 'dt', 'dt.id = p.description.id')
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
    ])
    .orderBy('p.id', 'ASC')
    .where('1=1');

  if (params.keyword) {
    query.andWhere('p.id = :id OR nt.contentEng LIKE :keyword OR nt.contentVie LIKE :keyword', {
      id: params.keyword,
      keyword: '%' + params.keyword + '%',
    });
  }

  const total = await query.getCount();
  const data = await query.getRawMany();
  return {
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
    })),
    total,
  };
}
