import { EntityManager, getConnection, getRepository } from 'typeorm';
import Category from '$entities/Category';
import Translation from '$entities/Translation';
import { ErrorCode } from '$enums/index';
import { ITranslation } from '$interfaces/common';
import Brand from '$entities/Brand';

interface CreateBrandDTO {
  name: ITranslation;
}

export async function createBrand(params: CreateBrandDTO) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const translationRepo = transaction.getRepository(Translation);
    const brandRepo = transaction.getRepository(Brand);

    const nameTranslation = await translationRepo.save({
      contentEng: params.name.contentEng,
      contentVie: params.name.contentVie,
      memo: 'brand.name',
    });

    const brand = await brandRepo.save({
      name: nameTranslation,
    });

    return { brandId: brand.id };
  });
}

interface UpdateBrandDTO {
  name: ITranslation;
  id: number;
}

export async function updateBrand(params: UpdateBrandDTO) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const translationRepo = transaction.getRepository(Translation);
    const brandRepo = transaction.getRepository(Brand);

    const brand = await brandRepo.findOne(params.id, {
      relations: ['name', 'category', 'category.name'],
    });
    if (!brand) {
      throw ErrorCode.Brand_Not_Exist;
    }

    await translationRepo.update(brand.name.id, {
      contentEng: params.name.contentEng,
      contentVie: params.name.contentVie,
    });

    return {
      id: params.id,
      name: {
        contentEng: params.name.contentEng,
        contentVie: params.name.contentVie,
      },
    };
  });
}

export async function getBrandById(id: number) {
  const brand = await getRepository(Brand).findOne(id, {
    relations: ['name'],
  });
  if (!brand) {
    throw ErrorCode.Brand_Not_Exist;
  }
  return {
    id,
    name: {
      contentEng: brand.name.contentEng,
      contentVie: brand.name.contentVie,
    },
  };
}

export async function deleteBrandById(id: number) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const brandRepo = transaction.getRepository(Brand);

    const brand = await brandRepo.findOne(id, { relations: ['name'] });
    if (!brand) {
      throw ErrorCode.Brand_Not_Exist;
    }
    const name = brand.name;
    await brandRepo.remove(brand);
    await transaction.getRepository(Translation).remove(name);
  });
}

interface ISearchBrand {
  keyword?: string;
}

export async function getBrands(params: ISearchBrand) {
  const query = getRepository(Brand)
    .createQueryBuilder('r')
    .innerJoin(Translation, 'nt', 'nt.id = r.name.id')
    .select(['r.id as id', 'nt.contentEng as nameEng', 'nt.contentVie as nameVie'])
    .orderBy('r.id', 'ASC')
    .where('1=1');

  if (params.keyword) {
    query.andWhere('r.id = :id OR nt.contentEng LIKE :keyword OR nt.contentVie LIKE :keyword', {
      id: params.keyword,
      keyword: '%' + params.keyword + '%',
    });
  }

  const total = await query.getCount();
  const data = await query.getRawMany();
  return {
    data: data.map((d) => ({
      id: d.id,
      name: {
        contentEng: d.nameEng,
        contentVie: d.nameVie,
      },
    })),
    total,
  };
}
