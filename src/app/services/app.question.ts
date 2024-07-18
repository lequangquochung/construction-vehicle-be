import { ErrorCode } from '$enums/index';
import { EntityManager, getConnection } from 'typeorm';
import Question from '$entities/Question';
import QuestionTitle from '$entities/QuestionTitle';

interface IUserCreateQuestion {
  phoneNumber: string;
  fullName: string;
  content: string;
  titleId: number;
  email?: string;
}

export async function userCreateQuestion(params: IUserCreateQuestion) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const questionRepo = transaction.getRepository(Question);

    const questionTitleRepo = transaction.getRepository(QuestionTitle);

    const title = await questionTitleRepo.findOne(params.titleId);
    if (!title) {
      throw ErrorCode.Question_Title_Not_Exist;
    }
    await questionRepo.save({
      email: params.email,
      phoneNumber: params.phoneNumber,
      fullName: params.fullName,
      content: params.content,
      title,
      isRead: false,
    });
  });
}
