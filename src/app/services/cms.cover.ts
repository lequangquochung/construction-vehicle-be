import Image from '$entities/Image';
import { ImageType } from '$enums/index';
import { EntityManager, getConnection } from 'typeorm';

interface CreateCoverDTO {
  srcImages: string[];
}

export async function changeCover(params: CreateCoverDTO) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const imageRepo = transaction.getRepository(Image);

    const covers = await imageRepo.find({ type: ImageType.COVER });

    if (covers.length > 0) {
      await imageRepo.delete(covers.map((e) => e.id));
    }

    const imagesToSave = params.srcImages.map((e) => {
      const image = new Image();
      image.srcImage = e;
      image.type = ImageType.COVER;
      image.title = "COVER_" + e;
      return image;
    });

    await imageRepo.save(imagesToSave);
  });
}

export async function getCover() {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const imageRepo = transaction.getRepository(Image);

    const covers = await imageRepo.find({ type: ImageType.COVER });

    if (covers.length === 0) {
      return [];
    }

    return covers.map(e => ({
      id: e.id,
      title: e.title,
      srcImage: e.srcImage,
    }));
  });
}
