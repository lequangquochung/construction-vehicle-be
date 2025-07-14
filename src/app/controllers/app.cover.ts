import { APP, Get } from "$helpers/decorator";
import * as service from '$services/cms.cover';

@APP('/cover')
export default class CoverController {
    @Get('', [])
    async userGetCover() {
      return await service.getCover();
    }
}