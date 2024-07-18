import { ROLE } from '$enums/index';
import { CMS, Get, Put, RequirePermission } from '$helpers/decorator';
import { convertDataConfig } from '$helpers/utils';
import * as service from '$services/cms.question';
import { Request } from 'express';

@CMS('/question')
export default class QuestionController {
  @Get('/')
  @RequirePermission([ROLE.ADMIN])
  async getQuestions(req: Request) {
    const { titleIds, isRead, keyword } = req.query;
    return await service.getQuestions({
      keyword: keyword ? keyword + '' : null,
      titleIds: titleIds ? titleIds + '' : null,
      isRead: isRead != null && isRead != '' ? convertDataConfig('BOOLEAN', isRead) : null,
    });
  }

  @Put('/mark-read')
  @RequirePermission([ROLE.ADMIN])
  async markAllRead(req: Request) {
    return await service.markRead({ ...req.body });
  }
}
