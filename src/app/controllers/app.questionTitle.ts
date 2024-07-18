import { LangKey } from '$enums/index';
import { APP, Get, Post } from '$helpers/decorator';
import * as service from '$services/app.questionTitle';
import { Request } from 'express';

@APP('/question-title')
export default class UserQuestionTitleController {
  @Get('/:langKey', [])
  async userGetQuestionTitles(req: Request) {
    const { langKey } = req.params;
    const languageKey = langKey as LangKey;
    return await service.userGetTitles(languageKey);
  }
}
