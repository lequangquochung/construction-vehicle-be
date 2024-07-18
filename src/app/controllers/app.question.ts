import { validate } from '$helpers/ajv';
import { APP, Post } from '$helpers/decorator';
import * as service from '$services/app.question';
import { createQuestionSchema } from '$validators/app.question';
import { Request } from 'express';

@APP('/question')
export default class UserQuestionController {
  @Post('/', [])
  async userCreateQuestion(req: Request) {
    const body = req.body;
    validate(createQuestionSchema, body);
    return await service.userCreateQuestion(body);
  }
}
