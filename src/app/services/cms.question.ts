import { EntityManager, getConnection, getRepository } from 'typeorm';
import Question from '$entities/Question';
import QuestionTitle from '$entities/QuestionTitle';
import { NewPagingParams } from '$interfaces/common';
import { assignPaging, returnPaging } from '$helpers/utils';
import { forEach } from 'lodash';

interface ISearchQuestion extends NewPagingParams {
  keyword?: string;
  titleIds: string;
  isRead: boolean;
}

export async function getQuestions(params: ISearchQuestion) {
  assignPaging(params);
  const query = getRepository(Question)
    .createQueryBuilder('q')
    .innerJoin(QuestionTitle, 'qt', 'qt.id = q.title.id')
    .select([
      'q.id as id',
      'q.email as email',
      'q.fullName as fullName',
      'q.phoneNumber as phoneNumber',
      'q.content as content',
      'qt.contentVi as title',
      'q.isRead as isRead',
    ])
    .where('1=1');

  if (params.keyword) {
    query.andWhere('q.email = :keyword OR q.phoneNumber = :keyword', {
      keyword: params.keyword,
    });
  }

  if (params.titleIds != null && params.titleIds.length > 0) {
    const titleIds = params.titleIds.split(',').map(Number);
    query.andWhere('q.title.id IN (:...titleIds)', { titleIds });
  }

  if (params.isRead != null) {
    query.andWhere('q.isRead = :isRead', {
      isRead: params.isRead,
    });
  }

  const total = await query.getCount();
  const data = await query.getRawMany();

  return returnPaging(
    {
      data: data.map((d) => ({
        id: d.id,
        fullName: d.fullName,
        email: d.email,
        phoneNumber: d.phoneNumber,
        content: d.content,
        title: d.title,
        isRead: d.isRead,
      })),
    },
    total,
    params
  );
}

export async function markRead(body: any) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const questionRepo = transaction.getRepository(Question);
    const questions = await questionRepo.findByIds(body.questionIds);
    questions.forEach((e) => {
      e.isRead = true;
    });
    if (questions.length > 0) {
      await questionRepo.save(questions);
    }
  });
}
