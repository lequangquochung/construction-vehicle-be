import { EntityManager, getConnection, getRepository } from 'typeorm';
import Category from '$entities/Category';
import Translation from '$entities/Translation';
import { ErrorCode } from '$enums/index';
import { ITranslation, PagingParams } from '$interfaces/common';

interface CreateCategoryDTO {
  name: ITranslation;
  image: string;
}

export async function createCategory(params: CreateCategoryDTO) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const categoryRepo = transaction.getRepository(Category);
    const translationRepo = transaction.getRepository(Translation);

    const nameTranslation = await translationRepo.save({
      contentEng: params.name.contentEng,
      contentVie: params.name.contentVie,
      memo: 'category.name',
    });

    const category = await categoryRepo.save({
      image: params.image,
      name: nameTranslation,
    });

    return { categoryId: category.id };
  });
}

interface UpdateCategoryDTO {
  name: ITranslation;
  image: string;
  id: number;
}

export async function updateCategory(params: UpdateCategoryDTO) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const categoryRepo = transaction.getRepository(Category);
    const translationRepo = transaction.getRepository(Translation);

    const category = await categoryRepo.findOne(params.id, { relations: ['name'] });
    if (!category) {
      throw ErrorCode.Category_Not_Exist;
    }

    await translationRepo.update(category.name.id, {
      contentEng: params.name.contentEng,
      contentVie: params.name.contentVie,
    });

    await categoryRepo.update(params.id, {
      image: params.image,
    });

    return {
      id: params.id,
      name: {
        contentEng: params.name.contentEng,
        contentVie: params.name.contentVie,
      },
      image: category.image,
    };
  });
}

export async function getCategoryById(id: number) {
  const category = await getRepository(Category).findOne(id, { relations: ['name'] });
  if (!category) {
    throw ErrorCode.Category_Not_Exist;
  }
  return {
    id,
    name: {
      contentEng: category.name.contentEng,
      contentVie: category.name.contentVie,
    },
    image: category.image,
  };
}

export async function deleteCategoryById(id: number) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const categoryRepo = transaction.getRepository(Category);

    const category = await categoryRepo.findOne(id, { relations: ['name'] });
    if (!category) {
      throw ErrorCode.Category_Not_Exist;
    }
    const name = category.name;
    await categoryRepo.remove(category);
    await transaction.getRepository(Translation).remove(name);
  });
}

interface ISearchCategory {
  keyword?: string;
}

export async function getCategories(params: ISearchCategory) {
  const query = getRepository(Category)
    .createQueryBuilder('r')
    .innerJoin(Translation, 'nt', 'nt.id = r.name.id')
    .select(['r.id', 'nt.contentEng as nameEng', 'nt.contentVie as nameVie', 'r.image'])
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
        image: d.image,
      },
    })),
    total,
  };
}
