import { CMS, Post } from '$helpers/decorator';
import upload from '$middlewares/fileUpload';

@CMS('/upload')
export default class EmployeeController {
  @Post('/array', [upload.array('files')])
  async uploadFiles(req: any) {
    const files = req.files;
    const filenames = files.map((file: { filename: string }) => file.filename);
    return filenames;
  }

  @Post('/single', [upload.single('file')])
  async upload(req: any) {
    const file = req.file;
    return file.filename;
  }
}
