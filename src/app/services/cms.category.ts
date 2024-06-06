import { EntityManager, getConnection, getRepository } from 'typeorm';
import Category from '$entities/Category';
import Translation from '$entities/Translation';
import { ErrorCode } from '$enums/index';
import { PagingParams } from '$interfaces/common';

interface CreateCategoryDTO {
  nameEng: string;
  nameVie: string;
  image: string;
}

export async function createCategory(params: CreateCategoryDTO) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const categoryRepo = transaction.getRepository(Category);
    const translationRepo = transaction.getRepository(Translation);

    const nameTranslation = await translationRepo.save({
      contentEng: params.nameEng,
      contentVie: params.nameVie,
      image: params.image,
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
  nameEng: string;
  nameVie: string;
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
      contentEng: params.nameEng,
      contentVie: params.nameVie,
    });

    await categoryRepo.update(params.id, {
      image: params.image,
    });

    return {
      id: params.id,
      nameEng: params.nameEng,
      nameVie: params.nameVie,
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
    nameEng: category.name.contentEng,
    nameVie: category.name.contentVie,
    image: category.image,
  };
}

export async function deleteCategoryById(id: number) {
  const categoryRepo = getRepository(Category);

  const category = await categoryRepo.findOne(id, { relations: ['name'] });
  if (!category) {
    throw ErrorCode.Category_Not_Exist;
  }
  const name = category.name;
  await categoryRepo.remove(category);
  await getRepository(Translation).remove(name);
}

interface ISearchCategory extends PagingParams {
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
    query.andWhere('nt.contentEng LIKE :keyword OR nt.contentVie LIKE :keyword', {
      keyword: '%' + params.keyword + '%',
    });
  }

  const total = await query.getCount();
  const data = await query.skip(params.skip).take(params.take).getMany();

  return { data, total };
}
