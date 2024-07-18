import { LangKey } from '../enums/index';
import { getRepository } from 'typeorm';
import QuestionTitle from '$entities/QuestionTitle';

export async function userGetTitles(langKey: LangKey) {
  const titles = await getRepository(QuestionTitle).find();
  return {
    titles: titles.map((e) => ({
      id: e.id,
      content: langKey == LangKey.ENG ? e.contentEn : e.contentVi,
    })),
  };
}
